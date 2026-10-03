/** Datos de entrada de `POST /api/aplicaciones-vacunas`. */
export interface CreateVaccineApplicationDto {
  consultation_id: number;
  vaccine_batch_id: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
}
