import { Request, Response } from "express";
import { Pet, PetI } from "./pet.model";
import { Owner } from "../owner/owner.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function assertActiveOwner(owner_id: number): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const owner = await Owner.findByPk(owner_id);
  if (!owner) {
    return { ok: false, status: 404, error: "Owner not found" };
  }
  if (!owner.is_active) {
    return { ok: false, status: 400, error: "Owner must be active" };
  }
  return { ok: true };
}

export class PetController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const pets = await Pet.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ pets });
    } catch (error) {
      res.status(500).json({ error: "Error fetching pets", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pet = await Pet.findByPk(id);
      if (!pet) {
        res.status(404).json({ error: "Pet not found" });
        return;
      }
      res.status(200).json({ pet });
    } catch (error) {
      res.status(500).json({ error: "Error fetching pet", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as PetI;
      const check = await assertActiveOwner(Number(body.owner_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const pet = await Pet.create({
        owner_id: body.owner_id,
        name: body.name,
        description: body.description,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ pet });
    } catch (error) {
      res.status(500).json({ error: "Error creating pet", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as PetI;
      const pet = await Pet.findByPk(id);
      if (!pet) {
        res.status(404).json({ error: "Pet not found" });
        return;
      }

      const check = await assertActiveOwner(Number(body.owner_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      await pet.update({
        owner_id: body.owner_id,
        name: body.name,
        description: body.description,
        is_active: body.is_active ?? pet.is_active,
      });

      res.status(200).json({ pet });
    } catch (error) {
      res.status(500).json({ error: "Error updating pet (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<PetI>;
      const pet = await Pet.findByPk(id);
      if (!pet) {
        res.status(404).json({ error: "Pet not found" });
        return;
      }

      if (body.owner_id !== undefined) {
        const check = await assertActiveOwner(Number(body.owner_id));
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      await pet.update(body);
      res.status(200).json({ pet });
    } catch (error) {
      res.status(500).json({ error: "Error updating pet (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pet = await Pet.findByPk(id);
      if (!pet) {
        res.status(404).json({ error: "Pet not found" });
        return;
      }
      await pet.destroy();
      res.status(200).json({ message: "Pet permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting pet", detail: String(error) });
    }
  }

  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const pet = await Pet.findByPk(id);
      if (!pet) {
        res.status(404).json({ error: "Pet not found" });
        return;
      }
      await pet.update({ is_active: false });
      res.status(200).json({ message: "Pet deactivated (logical delete)", pet });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating pet", detail: String(error) });
    }
  }
}
