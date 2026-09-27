import { Request, Response } from "express";
import { Op } from "sequelize";
import { Appointment, AppointmentI } from "./appointment.model";
import { Pet } from "../pet/pet.model";
import { Veterinarian } from "../veterinarian/veterinarian.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function assertActivePet(pet_id: number): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const pet = await Pet.findByPk(pet_id);
  if (!pet) {
    return { ok: false, status: 404, error: "Pet not found" };
  }
  if (!pet.is_active) {
    return { ok: false, status: 400, error: "Pet must be active" };
  }
  return { ok: true };
}

async function assertActiveVeterinarian(veterinarian_id: number): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const veterinarian = await Veterinarian.findByPk(veterinarian_id);
  if (!veterinarian) {
    return { ok: false, status: 404, error: "Veterinarian not found" };
  }
  if (!veterinarian.is_active) {
    return { ok: false, status: 400, error: "Veterinarian must be active" };
  }
  return { ok: true };
}

export class AppointmentController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const appointments = await Appointment.findAll({
        where: { state: { [Op.ne]: "cancelled" } },
      });
      res.status(200).json({ appointments });
    } catch (error) {
      res.status(500).json({ error: "Error fetching appointments", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      res.status(200).json({ appointment });
    } catch (error) {
      res.status(500).json({ error: "Error fetching appointment", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as AppointmentI;

      const petCheck = await assertActivePet(Number(body.pet_id));
      if (!petCheck.ok) {
        res.status(petCheck.status).json({ error: petCheck.error });
        return;
      }

      const vetCheck = await assertActiveVeterinarian(Number(body.veterinarian_id));
      if (!vetCheck.ok) {
        res.status(vetCheck.status).json({ error: vetCheck.error });
        return;
      }

      const appointment = await Appointment.create({
        pet_id: body.pet_id,
        veterinarian_id: body.veterinarian_id,
        start_date: body.start_date,
        end_date: body.end_date,
        reason: body.reason,
        state: body.state ?? "scheduled",
      });
      res.status(201).json({ appointment });
    } catch (error) {
      res.status(500).json({ error: "Error creating appointment", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as AppointmentI;
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }

      const petCheck = await assertActivePet(Number(body.pet_id));
      if (!petCheck.ok) {
        res.status(petCheck.status).json({ error: petCheck.error });
        return;
      }

      const vetCheck = await assertActiveVeterinarian(Number(body.veterinarian_id));
      if (!vetCheck.ok) {
        res.status(vetCheck.status).json({ error: vetCheck.error });
        return;
      }

      await appointment.update({
        pet_id: body.pet_id,
        veterinarian_id: body.veterinarian_id,
        start_date: body.start_date,
        end_date: body.end_date,
        reason: body.reason,
        state: body.state ?? appointment.state,
      });

      res.status(200).json({ appointment });
    } catch (error) {
      res.status(500).json({ error: "Error updating appointment (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<AppointmentI>;
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }

      if (body.pet_id !== undefined) {
        const petCheck = await assertActivePet(Number(body.pet_id));
        if (!petCheck.ok) {
          res.status(petCheck.status).json({ error: petCheck.error });
          return;
        }
      }

      if (body.veterinarian_id !== undefined) {
        const vetCheck = await assertActiveVeterinarian(Number(body.veterinarian_id));
        if (!vetCheck.ok) {
          res.status(vetCheck.status).json({ error: vetCheck.error });
          return;
        }
      }

      await appointment.update(body);
      res.status(200).json({ appointment });
    } catch (error) {
      res.status(500).json({ error: "Error updating appointment (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      await appointment.destroy();
      res.status(200).json({ message: "Appointment permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting appointment", detail: String(error) });
    }
  }

  /** Eliminación lógica → state = cancelled */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        res.status(404).json({ error: "Appointment not found" });
        return;
      }
      await appointment.update({ state: "cancelled" });
      res.status(200).json({
        message: "Appointment cancelled (logical delete)",
        appointment,
      });
    } catch (error) {
      res.status(500).json({ error: "Error cancelling appointment", detail: String(error) });
    }
  }
}
