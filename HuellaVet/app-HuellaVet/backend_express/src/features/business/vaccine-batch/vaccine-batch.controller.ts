import { Request, Response } from "express";
import { VaccineBatch, VaccineBatchI } from "./vaccine-batch.model";
import { Vaccine } from "../vaccine/vaccine.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function assertActiveVaccine(vaccine_id: number): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const vaccine = await Vaccine.findByPk(vaccine_id);
  if (!vaccine) {
    return { ok: false, status: 404, error: "Vaccine not found" };
  }
  if (!vaccine.is_active) {
    return { ok: false, status: 400, error: "Vaccine must be active" };
  }
  return { ok: true };
}

export class VaccineBatchController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const vaccineBatches = await VaccineBatch.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ vaccineBatches });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vaccine batches", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vaccineBatch = await VaccineBatch.findByPk(id);
      if (!vaccineBatch) {
        res.status(404).json({ error: "Vaccine batch not found" });
        return;
      }
      res.status(200).json({ vaccineBatch });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vaccine batch", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as VaccineBatchI;
      const check = await assertActiveVaccine(Number(body.vaccine_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const vaccineBatch = await VaccineBatch.create({
        vaccine_id: body.vaccine_id,
        name: body.name,
        description: body.description ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ vaccineBatch });
    } catch (error) {
      res.status(500).json({ error: "Error creating vaccine batch", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as VaccineBatchI;
      const vaccineBatch = await VaccineBatch.findByPk(id);
      if (!vaccineBatch) {
        res.status(404).json({ error: "Vaccine batch not found" });
        return;
      }

      const check = await assertActiveVaccine(Number(body.vaccine_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      await vaccineBatch.update({
        vaccine_id: body.vaccine_id,
        name: body.name,
        description: body.description ?? null,
        is_active: body.is_active ?? vaccineBatch.is_active,
      });

      res.status(200).json({ vaccineBatch });
    } catch (error) {
      res.status(500).json({ error: "Error updating vaccine batch (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<VaccineBatchI>;
      const vaccineBatch = await VaccineBatch.findByPk(id);
      if (!vaccineBatch) {
        res.status(404).json({ error: "Vaccine batch not found" });
        return;
      }

      if (body.vaccine_id !== undefined) {
        const check = await assertActiveVaccine(Number(body.vaccine_id));
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      await vaccineBatch.update(body);
      res.status(200).json({ vaccineBatch });
    } catch (error) {
      res.status(500).json({ error: "Error updating vaccine batch (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vaccineBatch = await VaccineBatch.findByPk(id);
      if (!vaccineBatch) {
        res.status(404).json({ error: "Vaccine batch not found" });
        return;
      }
      await vaccineBatch.destroy();
      res.status(200).json({ message: "Vaccine batch permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting vaccine batch", detail: String(error) });
    }
  }

  /** Eliminación lógica → is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vaccineBatch = await VaccineBatch.findByPk(id);
      if (!vaccineBatch) {
        res.status(404).json({ error: "Vaccine batch not found" });
        return;
      }
      await vaccineBatch.update({ is_active: false });
      res.status(200).json({
        message: "Vaccine batch deactivated (logical delete)",
        vaccineBatch,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating vaccine batch", detail: String(error) });
    }
  }
}
