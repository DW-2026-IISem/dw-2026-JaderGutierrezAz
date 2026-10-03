/** Datos de entrada de `POST /api/consultas`. */
export interface CreateConsultationDto {
  appointment_id: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
}
