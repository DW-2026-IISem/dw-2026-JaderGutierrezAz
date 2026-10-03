/** Datos de entrada de `POST /api/mascotas`. */
export interface CreatePetDto {
  owner_id: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
}
