import { Consultation, ConsultationI } from "../consultation.model";

/** Respuesta HTTP de una consulta. */
export type ConsultationResponseDto = ConsultationI;

/** Mapper modelo -> DTO de respuesta. */
export function toConsultationResponse(consultation: Consultation): ConsultationResponseDto {
  return consultation.toJSON() as ConsultationI;
}
