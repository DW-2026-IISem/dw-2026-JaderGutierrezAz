import { Request, Response } from "express";
import { Owner, OwnerI } from "./owner.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

export class OwnerController {
  // ================== READ ==================
  // (rellenar en el siguiente paso) getAll, luego getOne

  // ================== CREATE ==================
  // (rellenar más adelante)

  // ================== UPDATE ==================
  // (rellenar más adelante)

  // ================== DELETE ==================
  // (rellenar más adelante)
}
