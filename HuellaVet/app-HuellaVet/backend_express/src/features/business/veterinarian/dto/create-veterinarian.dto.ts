/** Datos de entrada de `POST /api/veterinarios`. */
export interface CreateVeterinarianDto {
  name: string;
  description?: string | null;
  is_active?: boolean;
}
