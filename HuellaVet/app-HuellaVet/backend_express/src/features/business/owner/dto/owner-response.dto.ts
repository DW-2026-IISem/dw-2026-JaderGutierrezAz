import { Owner, OwnerI } from "../owner.model";

/** Respuesta HTTP de un propietario. */
export type OwnerResponseDto = OwnerI;

/** Mapper modelo -> DTO de respuesta. */
export function toOwnerResponse(owner: Owner): OwnerResponseDto {
  return owner.toJSON() as OwnerI;
}
