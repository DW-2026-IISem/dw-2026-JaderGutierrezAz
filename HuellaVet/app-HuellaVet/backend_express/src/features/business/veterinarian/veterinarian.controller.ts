import { Request, Response } from "express";
import { Veterinarian, VeterinarianI } from "./veterinarian.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class VeterinarianController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const veterinarians = await Veterinarian.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ veterinarians });
    } catch (error) {
      res.status(500).json({ error: "Error fetching veterinarians", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const veterinarian = await Veterinarian.findByPk(id);
      if (!veterinarian) {
        res.status(404).json({ error: "Veterinarian not found" });
        return;
      }
      res.status(200).json({ veterinarian });
    } catch (error) {
      res.status(500).json({ error: "Error fetching veterinarian", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as VeterinarianI;
      const veterinarian = await Veterinarian.create({
        name: body.name,
        description: body.description ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ veterinarian });
    } catch (error) {
      res.status(500).json({ error: "Error creating veterinarian", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as VeterinarianI;
      const veterinarian = await Veterinarian.findByPk(id);
      if (!veterinarian) {
        res.status(404).json({ error: "Veterinarian not found" });
        return;
      }

      await veterinarian.update({
        name: body.name,
        description: body.description ?? null,
        is_active: body.is_active ?? veterinarian.is_active,
      });

      res.status(200).json({ veterinarian });
    } catch (error) {
      res.status(500).json({ error: "Error updating veterinarian (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<VeterinarianI>;
      const veterinarian = await Veterinarian.findByPk(id);
      if (!veterinarian) {
        res.status(404).json({ error: "Veterinarian not found" });
        return;
      }

      await veterinarian.update(body);
      res.status(200).json({ veterinarian });
    } catch (error) {
      res.status(500).json({ error: "Error updating veterinarian (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const veterinarian = await Veterinarian.findByPk(id);
      if (!veterinarian) {
        res.status(404).json({ error: "Veterinarian not found" });
        return;
      }
      await veterinarian.destroy();
      res.status(200).json({ message: "Veterinarian permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting veterinarian", detail: String(error) });
    }
  }

  /** Eliminación lógica → is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const veterinarian = await Veterinarian.findByPk(id);
      if (!veterinarian) {
        res.status(404).json({ error: "Veterinarian not found" });
        return;
      }
      await veterinarian.update({ is_active: false });
      res.status(200).json({
        message: "Veterinarian deactivated (logical delete)",
        veterinarian,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating veterinarian", detail: String(error) });
    }
  }
}
