/**
 * Datos de entrada de `PUT /api/aplicaciones-vacunas/:id` (reemplazo completo).
 * `is_active` no está aquí: solo cambia con el borrado lógico (`/deactivate`).
 */
export interface UpdateVaccineApplicationDto {
  consultation_id: number;
  vaccine_batch_id: number;
  name: string;
  description?: string | null;
}
