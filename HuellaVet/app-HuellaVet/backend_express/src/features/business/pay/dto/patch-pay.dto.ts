import { UpdatePayDto } from "./update-pay.dto";
import { PayState } from "../pay.model";

/**
 * Datos de entrada de `PATCH /api/pagos/:id` (actualización parcial).
 * `state` SÍ puede llegar por PATCH (p. ej. marcar como "paid"), igual que en
 * `appointment`.
 */
export type PatchPayDto = Partial<UpdatePayDto> & {
  state?: PayState;
};
