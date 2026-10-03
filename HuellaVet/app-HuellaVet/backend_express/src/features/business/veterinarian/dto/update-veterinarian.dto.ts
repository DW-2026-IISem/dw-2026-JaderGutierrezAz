/**
 * Datos de entrada de `PUT /api/veterinarios/:id` (reemplazo completo).
 * `is_active` no está aquí: solo cambia con el borrado lógico (`/deactivate`).
 */
export interface UpdateVeterinarianDto {
  name: string;
  description?: string | null;
}
