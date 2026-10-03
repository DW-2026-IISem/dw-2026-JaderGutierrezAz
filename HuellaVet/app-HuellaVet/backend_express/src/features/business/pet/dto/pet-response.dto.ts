import { Pet, PetI } from "../pet.model";

/** Respuesta HTTP de una mascota. */
export type PetResponseDto = PetI;

/** Mapper modelo -> DTO de respuesta. */
export function toPetResponse(pet: Pet): PetResponseDto {
  return pet.toJSON() as PetI;
}
