/** Datos de entrada de `POST /api/vacunas`. */
export interface CreateVaccineDto {
  name: string;
  description?: string | null;
  is_active?: boolean;
}
