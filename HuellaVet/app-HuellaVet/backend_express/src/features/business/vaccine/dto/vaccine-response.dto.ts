import { Vaccine, VaccineI } from "../vaccine.model";

/** Respuesta HTTP de una vacuna. */
export type VaccineResponseDto = VaccineI;

/** Mapper modelo -> DTO de respuesta. */
export function toVaccineResponse(vaccine: Vaccine): VaccineResponseDto {
  return vaccine.toJSON() as VaccineI;
}
