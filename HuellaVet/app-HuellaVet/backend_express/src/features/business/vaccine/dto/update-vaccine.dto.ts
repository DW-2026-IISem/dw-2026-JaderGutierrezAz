/**
 * Datos de entrada de `PUT /api/vacunas/:id` (reemplazo completo).
 * `is_active` no está aquí: solo cambia con el borrado lógico (`/deactivate`).
 */
export interface UpdateVaccineDto {
  name: string;
  description?: string | null;
}
