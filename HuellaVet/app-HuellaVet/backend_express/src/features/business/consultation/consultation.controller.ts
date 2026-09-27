import { Request, Response } from "express";
import { Consultation, ConsultationI } from "./consultation.model";
import { Appointment } from "../appointment/appointment.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function assertValidAppointment(appointment_id: number): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const appointment = await Appointment.findByPk(appointment_id);
  if (!appointment) {
    return { ok: false, status: 404, error: "Appointment not found" };
  }
  if (appointment.state === "cancelled") {
    return { ok: false, status: 400, error: "Appointment must not be cancelled" };
  }
  return { ok: true };
}

export class ConsultationController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const consultations = await Consultation.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ consultations });
    } catch (error) {
      res.status(500).json({ error: "Error fetching consultations", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        res.status(404).json({ error: "Consultation not found" });
        return;
      }
      res.status(200).json({ consultation });
    } catch (error) {
      res.status(500).json({ error: "Error fetching consultation", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as ConsultationI;
      const check = await assertValidAppointment(Number(body.appointment_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const consultation = await Consultation.create({
        appointment_id: body.appointment_id,
        name: body.name,
        description: body.description ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ consultation });
    } catch (error) {
      res.status(500).json({ error: "Error creating consultation", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as ConsultationI;
      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        res.status(404).json({ error: "Consultation not found" });
        return;
      }

      const check = await assertValidAppointment(Number(body.appointment_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      await consultation.update({
        appointment_id: body.appointment_id,
        name: body.name,
        description: body.description ?? null,
        is_active: body.is_active ?? consultation.is_active,
      });

      res.status(200).json({ consultation });
    } catch (error) {
      res.status(500).json({ error: "Error updating consultation (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<ConsultationI>;
      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        res.status(404).json({ error: "Consultation not found" });
        return;
      }

      if (body.appointment_id !== undefined) {
        const check = await assertValidAppointment(Number(body.appointment_id));
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      await consultation.update(body);
      res.status(200).json({ consultation });
    } catch (error) {
      res.status(500).json({ error: "Error updating consultation (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        res.status(404).json({ error: "Consultation not found" });
        return;
      }
      await consultation.destroy();
      res.status(200).json({ message: "Consultation permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting consultation", detail: String(error) });
    }
  }

  /** Eliminación lógica → is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const consultation = await Consultation.findByPk(id);
      if (!consultation) {
        res.status(404).json({ error: "Consultation not found" });
        return;
      }
      await consultation.update({ is_active: false });
      res.status(200).json({
        message: "Consultation deactivated (logical delete)",
        consultation,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating consultation", detail: String(error) });
    }
  }
}
