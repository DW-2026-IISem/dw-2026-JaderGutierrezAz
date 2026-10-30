import { Money, Timestamps } from './api.model';

export type PayReferenceType = 'appointment';
export type PayState = 'pending' | 'paid' | 'cancelled';

/** Tabla `pays` — /api/pagos. Usa `state`. `amount` llega como string. Solo se soporta referenciar una cita. */
export interface Pay extends Timestamps {
  id: number;
  reference_type: PayReferenceType;
  reference_id: number;
  method: string;
  amount: Money;
  date: string;
  state: PayState;
}

/** Cuerpo de `POST`. Al escribir, `amount` es un número. `state` es opcional (por defecto 'pending'). */
export interface PayCreate {
  reference_type: PayReferenceType;
  reference_id: number;
  method: string;
  amount: number;
  date: string;
  state?: PayState;
}

/** Cuerpo de `PUT`: marcar como pagado es un PATCH explícito. */
export interface PayUpdate {
  reference_type: PayReferenceType;
  reference_id: number;
  method: string;
  amount: number;
  date: string;
}

/** Cuerpo de `PATCH`: `state` SÍ puede viajar (p. ej. 'paid'). */
export type PayPatch = Partial<PayUpdate> & { state?: PayState };
