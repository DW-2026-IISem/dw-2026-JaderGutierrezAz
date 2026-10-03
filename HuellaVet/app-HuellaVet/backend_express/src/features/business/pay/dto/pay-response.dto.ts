import { Pay, PayI } from "../pay.model";

/** Respuesta HTTP de un pago. */
export type PayResponseDto = PayI;

/** Mapper modelo -> DTO de respuesta. */
export function toPayResponse(pay: Pay): PayResponseDto {
  return pay.toJSON() as PayI;
}
