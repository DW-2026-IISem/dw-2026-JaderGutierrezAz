import { Request, Response } from "express";
import { VaccineApplication, VaccineApplicationI } from "./vaccine-application.model";
import { Consultation } from "../consultation/consultation.model";
import { VaccineBatch } from "../vaccine-batch/vaccine-batch.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

type CheckResult = { ok: true } | { ok: false; status: number; error: string };

async function assertActiveConsultation(consultation_id: number): Promise<CheckResult> {
  const consultation = await Consultation.findByPk(consultation_id);
  if (!consultation) {
    return { ok: false, status: 404, error: "Consultation not found" };
  }
  if (!consultation.is_active) {
    return { ok: false, status: 400, error: "Consultation must be active" };
  }
  return { ok: true };
}

async function assertActiveVaccineBatch(vaccine_batch_id: number): Promise<CheckResult> {
  const batch = await VaccineBatch.findByPk(vaccine_batch_id);
  if (!batch) {
    return { ok: false, status: 404, error: "Vaccine batch not found" };
  }
  if (!batch.is_active) {
    return { ok: false, status: 400, error: "Vaccine batch must be active" };
  }
  return { ok: true };
}

export class VaccineApplicationController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const vaccineApplications = await VaccineApplication.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ vaccineApplications });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vaccine applications", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vaccineApplication = await VaccineApplication.findByPk(id);
      if (!vaccineApplication) {
        res.status(404).json({ error: "Vaccine application not found" });
        return;
      }
      res.status(200).json({ vaccineApplication });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vaccine application", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as VaccineApplicationI;

      const consultationCheck = await assertActiveConsultation(Number(body.consultation_id));
      if (!consultationCheck.ok) {
        res.status(consultationCheck.status).json({ error: consultationCheck.error });
        return;
      }

      const batchCheck = await assertActiveVaccineBatch(Number(body.vaccine_batch_id));
      if (!batchCheck.ok) {
        res.status(batchCheck.status).json({ error: batchCheck.error });
        return;
      }

      const vaccineApplication = await VaccineApplication.create({
        consultation_id: body.consultation_id,
        vaccine_batch_id: body.vaccine_batch_id,
        name: body.name,
        description: body.description ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ vaccineApplication });
    } catch (error) {
      res.status(500).json({ error: "Error creating vaccine application", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as VaccineApplicationI;
      const vaccineApplication = await VaccineApplication.findByPk(id);
      if (!vaccineApplication) {
        res.status(404).json({ error: "Vaccine application not found" });
        return;
      }

      const consultationCheck = await assertActiveConsultation(Number(body.consultation_id));
      if (!consultationCheck.ok) {
        res.status(consultationCheck.status).json({ error: consultationCheck.error });
        return;
      }

      const batchCheck = await assertActiveVaccineBatch(Number(body.vaccine_batch_id));
      if (!batchCheck.ok) {
        res.status(batchCheck.status).json({ error: batchCheck.error });
        return;
      }

      await vaccineApplication.update({
        consultation_id: body.consultation_id,
        vaccine_batch_id: body.vaccine_batch_id,
        name: body.name,
        description: body.description ?? null,
        is_active: body.is_active ?? vaccineApplication.is_active,
      });

      res.status(200).json({ vaccineApplication });
    } catch (error) {
      res.status(500).json({ error: "Error updating vaccine application (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<VaccineApplicationI>;
      const vaccineApplication = await VaccineApplication.findByPk(id);
      if (!vaccineApplication) {
        res.status(404).json({ error: "Vaccine application not found" });
        return;
      }

      if (body.consultation_id !== undefined) {
        const consultationCheck = await assertActiveConsultation(Number(body.consultation_id));
        if (!consultationCheck.ok) {
          res.status(consultationCheck.status).json({ error: consultationCheck.error });
          return;
        }
      }

      if (body.vaccine_batch_id !== undefined) {
        const batchCheck = await assertActiveVaccineBatch(Number(body.vaccine_batch_id));
        if (!batchCheck.ok) {
          res.status(batchCheck.status).json({ error: batchCheck.error });
          return;
        }
      }

      await vaccineApplication.update(body);
      res.status(200).json({ vaccineApplication });
    } catch (error) {
      res.status(500).json({ error: "Error updating vaccine application (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vaccineApplication = await VaccineApplication.findByPk(id);
      if (!vaccineApplication) {
        res.status(404).json({ error: "Vaccine application not found" });
        return;
      }
      await vaccineApplication.destroy();
      res.status(200).json({ message: "Vaccine application permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting vaccine application", detail: String(error) });
    }
  }

  /** Eliminación lógica → is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vaccineApplication = await VaccineApplication.findByPk(id);
      if (!vaccineApplication) {
        res.status(404).json({ error: "Vaccine application not found" });
        return;
      }
      await vaccineApplication.update({ is_active: false });
      res.status(200).json({
        message: "Vaccine application deactivated (logical delete)",
        vaccineApplication,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating vaccine application", detail: String(error) });
    }
  }
}
