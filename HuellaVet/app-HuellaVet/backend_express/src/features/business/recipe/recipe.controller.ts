import { Request, Response } from "express";
import { Recipe, RecipeI } from "./recipe.model";
import { Consultation } from "../consultation/consultation.model";

function paramId(req: Request): number {
  const raw = req.params.id;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return Number(value);
}

async function assertActiveConsultation(consultation_id: number): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const consultation = await Consultation.findByPk(consultation_id);
  if (!consultation) {
    return { ok: false, status: 404, error: "Consultation not found" };
  }
  if (!consultation.is_active) {
    return { ok: false, status: 400, error: "Consultation must be active" };
  }
  return { ok: true };
}

export class RecipeController {
  // ================== READ ==================
  public async getAll(req: Request, res: Response) {
    try {
      const recipes = await Recipe.findAll({
        where: { is_active: true },
      });
      res.status(200).json({ recipes });
    } catch (error) {
      res.status(500).json({ error: "Error fetching recipes", detail: String(error) });
    }
  }

  public async getOne(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const recipe = await Recipe.findByPk(id);
      if (!recipe) {
        res.status(404).json({ error: "Recipe not found" });
        return;
      }
      res.status(200).json({ recipe });
    } catch (error) {
      res.status(500).json({ error: "Error fetching recipe", detail: String(error) });
    }
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response) {
    try {
      const body = req.body as RecipeI;
      const check = await assertActiveConsultation(Number(body.consultation_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      const recipe = await Recipe.create({
        consultation_id: body.consultation_id,
        name: body.name,
        description: body.description ?? null,
        is_active: body.is_active ?? true,
      });
      res.status(201).json({ recipe });
    } catch (error) {
      res.status(500).json({ error: "Error creating recipe", detail: String(error) });
    }
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as RecipeI;
      const recipe = await Recipe.findByPk(id);
      if (!recipe) {
        res.status(404).json({ error: "Recipe not found" });
        return;
      }

      const check = await assertActiveConsultation(Number(body.consultation_id));
      if (!check.ok) {
        res.status(check.status).json({ error: check.error });
        return;
      }

      await recipe.update({
        consultation_id: body.consultation_id,
        name: body.name,
        description: body.description ?? null,
        is_active: body.is_active ?? recipe.is_active,
      });

      res.status(200).json({ recipe });
    } catch (error) {
      res.status(500).json({ error: "Error updating recipe (PUT)", detail: String(error) });
    }
  }

  public async updatePatch(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const body = req.body as Partial<RecipeI>;
      const recipe = await Recipe.findByPk(id);
      if (!recipe) {
        res.status(404).json({ error: "Recipe not found" });
        return;
      }

      if (body.consultation_id !== undefined) {
        const check = await assertActiveConsultation(Number(body.consultation_id));
        if (!check.ok) {
          res.status(check.status).json({ error: check.error });
          return;
        }
      }

      await recipe.update(body);
      res.status(200).json({ recipe });
    } catch (error) {
      res.status(500).json({ error: "Error updating recipe (PATCH)", detail: String(error) });
    }
  }

  // ================== DELETE ==================
  /** Eliminación física */
  public async deletePhysical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const recipe = await Recipe.findByPk(id);
      if (!recipe) {
        res.status(404).json({ error: "Recipe not found" });
        return;
      }
      await recipe.destroy();
      res.status(200).json({ message: "Recipe permanently deleted", id });
    } catch (error) {
      res.status(500).json({ error: "Error deleting recipe", detail: String(error) });
    }
  }

  /** Eliminación lógica → is_active = false */
  public async deleteLogical(req: Request, res: Response) {
    try {
      const id = paramId(req);
      const recipe = await Recipe.findByPk(id);
      if (!recipe) {
        res.status(404).json({ error: "Recipe not found" });
        return;
      }
      await recipe.update({ is_active: false });
      res.status(200).json({
        message: "Recipe deactivated (logical delete)",
        recipe,
      });
    } catch (error) {
      res.status(500).json({ error: "Error deactivating recipe", detail: String(error) });
    }
  }
}
