/**
 * Datos de entrada de `PUT /api/propietarios/:id` (reemplazo completo).
 * `is_active` no está aquí a propósito: solo cambia con el borrado lógico
 * (`/deactivate`).
 */
export interface UpdateOwnerDto {
  document_type: string;
  document_number: string;
  name: string;
  phone?: string | null;
  email?: string | null;
}
