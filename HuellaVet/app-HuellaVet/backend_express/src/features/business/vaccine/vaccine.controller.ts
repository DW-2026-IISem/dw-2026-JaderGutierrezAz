import { Request, Response } from "express";
import { Vaccine, VaccineI } from "./vaccine.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class VaccineController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const vaccines = await Vaccine.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ vaccines });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vaccines", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vaccine = await Vaccine.findByPk(id);
      if (!vaccine) {
        res.status(404).json({ error: "Vaccine not found" });
        return;
      }
      res.status(200).json({ vaccine });
    } catch (error) {
      res.status(500).json({ error: "Error fetching vaccine", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as VaccineI;
      const vaccine = await Vaccine.create({
        name: body.name,
        description: body.description ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ vaccine });
    } catch (error) {
      res.status(500).json({ error: "Error creating vaccine", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as VaccineI;
      const vaccine = await Vaccine.findByPk(id);
      if (!vaccine) {
        res.status(404).json({ error: "Vaccine not found" });
        return;
      }

      await vaccine.update({
        name: body.name,
        description: body.description ?? null,
        is_active: body.is_active ?? vaccine.is_active,
      });

      res.status(200).json({ vaccine });
    } catch (error) {
      res.status(500).json({ error: "Error updating vaccine (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<VaccineI>;
      const vaccine = await Vaccine.findByPk(id);
      if (!vaccine) {
        res.status(404).json({ error: "Vaccine not found" });
        return;
      }

      await vaccine.update(body);
      res.status(200).json({ vaccine });
    } catch (error) {
      res.status(500).json({ error: "Error updating vaccine (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vaccine = await Vaccine.findByPk(id);
      if (!vaccine) {
        res.status(404).json({ error: "Vaccine not found" });
        return;
      }
      await vaccine.destroy();
      res.status(200).json({ message: "Vaccine permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting vaccine", detail: String(error) });
    }
  }

  /** Eliminación lógica → is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const vaccine = await Vaccine.findByPk(id);
      if (!vaccine) {
        res.status(404).json({ error: "Vaccine not found" });
        return;
      }
      await vaccine.update({ is_active: false });
      res.status(200).json({
        message: "Vaccine deactivated (logical delete)",
        vaccine,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating vaccine", detail: String(error) });
    }
  }
}
