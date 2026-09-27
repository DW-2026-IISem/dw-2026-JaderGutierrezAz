import { Request, Response } from "express";
import { Owner, OwnerI } from "./owner.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class OwnerController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const owners = await Owner.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ owners });
    } catch (error) {
      res.status(500).json({ error: "Error fetching owners", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const owner = await Owner.findByPk(id);
      if (!owner) {
        res.status(404).json({ error: "Owner not found" });
        return;
      }
      res.status(200).json({ owner });
    } catch (error) {
      res.status(500).json({ error: "Error fetching owner", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as OwnerI;
      const owner = await Owner.create({
        document_type: body.document_type,
        document_number: body.document_number,
        name: body.name,
        phone: body.phone,
        email: body.email,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ owner });
    } catch (error) {
      res.status(500).json({ error: "Error creating owner", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  // (rellenar más adelante)

  // ================== DELETE ==================
  // (rellenar más adelante)
}
