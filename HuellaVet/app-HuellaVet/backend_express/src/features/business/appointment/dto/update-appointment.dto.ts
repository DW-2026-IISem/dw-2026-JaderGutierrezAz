/**
 * Datos de entrada de `PUT /api/citas/:id` (reemplazo completo).
 * `state` no está aquí: reprogramar una cita no cambia su estado por sí solo.
 */
export interface UpdateAppointmentDto {
  pet_id: number;
  veterinarian_id: number;
  start_date: Date;
  end_date: Date;
  reason: string;
}
