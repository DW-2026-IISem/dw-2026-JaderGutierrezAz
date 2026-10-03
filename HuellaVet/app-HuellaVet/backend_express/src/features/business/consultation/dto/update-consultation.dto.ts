/**
 * Datos de entrada de `PUT /api/consultas/:id` (reemplazo completo).
 * `is_active` no está aquí: solo cambia con el borrado lógico (`/deactivate`).
 */
export interface UpdateConsultationDto {
  appointment_id: number;
  name: string;
  description?: string | null;
}
