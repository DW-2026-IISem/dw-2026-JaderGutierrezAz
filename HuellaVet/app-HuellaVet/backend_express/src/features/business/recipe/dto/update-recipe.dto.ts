/**
 * Datos de entrada de `PUT /api/recetas/:id` (reemplazo completo).
 * `is_active` no está aquí: solo cambia con el borrado lógico (`/deactivate`).
 */
export interface UpdateRecipeDto {
  consultation_id: number;
  name: string;
  description?: string | null;
}
