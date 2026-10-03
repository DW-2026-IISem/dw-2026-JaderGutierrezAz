import { Veterinarian, VeterinarianI } from "../veterinarian.model";

/** Respuesta HTTP de un veterinario. */
export type VeterinarianResponseDto = VeterinarianI;

/** Mapper modelo -> DTO de respuesta. */
export function toVeterinarianResponse(veterinarian: Veterinarian): VeterinarianResponseDto {
  return veterinarian.toJSON() as VeterinarianI;
}
