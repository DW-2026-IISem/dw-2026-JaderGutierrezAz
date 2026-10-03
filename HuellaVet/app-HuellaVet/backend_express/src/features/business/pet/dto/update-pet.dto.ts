/**
 * Datos de entrada de `PUT /api/mascotas/:id` (reemplazo completo).
 * `is_active` no está aquí: solo cambia con el borrado lógico (`/deactivate`).
 */
export interface UpdatePetDto {
  owner_id: number;
  name: string;
  description?: string | null;
}
