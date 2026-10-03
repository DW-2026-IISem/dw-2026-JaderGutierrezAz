/** Datos de entrada de `POST /api/recetas`. */
export interface CreateRecipeDto {
  consultation_id: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
}
