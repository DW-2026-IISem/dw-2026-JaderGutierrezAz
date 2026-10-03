import { PayReferenceType, PayState } from "../pay.model";

/** Datos de entrada de `POST /api/pagos`. */
export interface CreatePayDto {
  reference_type: PayReferenceType;
  reference_id: number;
  method: string;
  amount: number;
  date: Date;
  state?: PayState;
}
