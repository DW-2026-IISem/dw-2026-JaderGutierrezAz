import { Timestamps } from './api.model';

/** Tabla `recipes` — /api/recetas. Pertenece a una consulta. */
export interface Recipe extends Timestamps {
  id: number;
  consultation_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface RecipeCreate {
  consultation_id: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export interface RecipeUpdate {
  consultation_id: number;
  name: string;
  description?: string | null;
}
