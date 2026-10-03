/** Datos de entrada de `POST /api/propietarios`. */
export interface CreateOwnerDto {
  document_type: string;
  document_number: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  is_active?: boolean;
}
