/** Datos de entrada de `POST /api/lotes-vacunas`. */
export interface CreateVaccineBatchDto {
  vaccine_id: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
}
