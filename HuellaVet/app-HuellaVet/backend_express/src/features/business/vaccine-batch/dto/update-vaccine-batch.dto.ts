/**
 * Datos de entrada de `PUT /api/lotes-vacunas/:id` (reemplazo completo).
 * `is_active` no está aquí: solo cambia con el borrado lógico (`/deactivate`).
 */
export interface UpdateVaccineBatchDto {
  vaccine_id: number;
  name: string;
  description?: string | null;
}
