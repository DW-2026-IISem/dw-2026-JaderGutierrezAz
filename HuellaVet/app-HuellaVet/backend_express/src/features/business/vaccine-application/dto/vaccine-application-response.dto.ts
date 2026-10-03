import { VaccineApplication, VaccineApplicationI } from "../vaccine-application.model";

/** Respuesta HTTP de una aplicación de vacuna. */
export type VaccineApplicationResponseDto = VaccineApplicationI;

/** Mapper modelo -> DTO de respuesta. */
export function toVaccineApplicationResponse(
  vaccineApplication: VaccineApplication
): VaccineApplicationResponseDto {
  return vaccineApplication.toJSON() as VaccineApplicationI;
}
