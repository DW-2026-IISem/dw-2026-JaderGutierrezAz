import { VaccineBatch, VaccineBatchI } from "../vaccine-batch.model";

/** Respuesta HTTP de un lote de vacunas. */
export type VaccineBatchResponseDto = VaccineBatchI;

/** Mapper modelo -> DTO de respuesta. */
export function toVaccineBatchResponse(vaccineBatch: VaccineBatch): VaccineBatchResponseDto {
  return vaccineBatch.toJSON() as VaccineBatchI;
}
