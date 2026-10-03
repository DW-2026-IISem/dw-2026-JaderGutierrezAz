import { PayReferenceType } from "../pay.model";

/**
 * Datos de entrada de `PUT /api/pagos/:id` (reemplazo completo).
 * `state` no está aquí: cancelar es `/deactivate`, marcar como pagado es un
 * PATCH explícito (acción de negocio, no un reemplazo de atributos).
 */
export interface UpdatePayDto {
  reference_type: PayReferenceType;
  reference_id: number;
  method: string;
  amount: number;
  date: Date;
}
