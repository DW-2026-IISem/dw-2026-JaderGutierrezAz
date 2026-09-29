import { Request, Response } from "express";
import { Op } from "sequelize";
import { Pay, PayI, PayReferenceType } from "./pay.model";
import { Appointment } from "../appointment/appointment.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

type CheckResult = { ok: true } | { ok: false; status: number; error: string };

/**
 * Referencia polimórfica: reference_type decide en cuál tabla se busca reference_id.
 * Hoy solo existe "appointment" en el diagrama; agregar un tipo nuevo
 * (ej. "consultation") solo requiere sumar una entrada aquí.
 */
const REFERENCE_VALIDATORS: Record<PayReferenceType, (id: number) => Promise<CheckResult>> = {
  appointment: async (id) => {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) {
      return { ok: false, status: 404, error: "Referenced appointment not found" };
    }
    if (appointment.state === "cancelled") {
      return { ok: false, status: 400, error: "Referenced appointment is cancelled" };
    }
    return { ok: true };
  },
};

async function assertValidReference(reference_type: PayReferenceType, reference_id: number): Promise<CheckResult> {
  const validator = REFERENCE_VALIDATORS[reference_type];
  if (!validator) {
    return { ok: false, status: 400, error: `Unsupported reference_type: ${reference_type}` };
  }
  return validator(reference_id);
}

export class PayController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const pays = await Pay.findAll({
        where: { state: { [Op.ne]: "cancelled" } },
      });
      res.status(200).json({ pays });
    } catch (error) {
      res.status(500).json({ error: "Error fetching pays", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pay = await Pay.findByPk(id);
      if (!pay) {
        res.status(404).json({ error: "Pay not found" });
        return;
      }
      res.status(200).json({ pay });
    } catch (error) {
      res.status(500).json({ error: "Error fetching pay", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as PayI;

      const check = await assertValidReference(body.reference_type, Number(body.reference_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const pay = await Pay.create({
        reference_type: body.reference_type,
        reference_id: body.reference_id,
        method: body.method,
        amount: body.amount,
        date: body.date,
        state: body.state ?? "pending",
      });
      res.status(201).json({ pay });
    } catch (error) {
      res.status(500).json({ error: "Error creating pay", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as PayI;
      const pay = await Pay.findByPk(id);
      if (!pay) {
        res.status(404).json({ error: "Pay not found" });
        return;
      }

      const check = await assertValidReference(body.reference_type, Number(body.reference_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      await pay.update({
        reference_type: body.reference_type,
        reference_id: body.reference_id,
        method: body.method,
        amount: body.amount,
        date: body.date,
        state: body.state ?? pay.state,
      });

      res.status(200).json({ pay });
    } catch (error) {
      res.status(500).json({ error: "Error updating pay (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<PayI>;
      const pay = await Pay.findByPk(id);
      if (!pay) {
        res.status(404).json({ error: "Pay not found" });
        return;
      }

      if (body.reference_type !== undefined || body.reference_id !== undefined) {
        const referenceType = body.reference_type ?? pay.reference_type;
        const referenceId = body.reference_id ?? pay.reference_id;
        const check = await assertValidReference(referenceType, Number(referenceId));
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      await pay.update(body);
      res.status(200).json({ pay });
    } catch (error) {
      res.status(500).json({ error: "Error updating pay (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pay = await Pay.findByPk(id);
      if (!pay) {
        res.status(404).json({ error: "Pay not found" });
        return;
      }
      await pay.destroy();
      res.status(200).json({ message: "Pay permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting pay", detail: String(error) });
    }
  }

  /** Eliminación lógica → state = cancelled */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pay = await Pay.findByPk(id);
      if (!pay) {
        res.status(404).json({ error: "Pay not found" });
        return;
      }
      await pay.update({ state: "cancelled" });
      res.status(200).json({
        message: "Pay cancelled (logical delete)",
        pay,
      });
    } catch (error) {
      res.status(500).json({ error: "Error cancelling pay", detail: String(error) });
    }
  }
}
