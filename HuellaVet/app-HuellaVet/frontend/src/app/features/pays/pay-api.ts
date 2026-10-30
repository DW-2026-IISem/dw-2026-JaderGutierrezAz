import { Injectable } from '@angular/core';
import { Pay, PayCreate, PayPatch, PayUpdate } from '../../core/models/pay.model';
import { CrudApi } from '../../core/services/crud-api';

/**
 * /api/pagos — la lista llega en `pays` (no `payments`).
 * El PATCH acepta `state` (marcar como pagado), por eso su cuerpo es `PayPatch`.
 */
@Injectable({ providedIn: 'root' })
export class PayApi extends CrudApi<Pay, PayCreate, PayUpdate, PayPatch> {
  constructor() {
    super('pagos', 'pays', 'pay');
  }
}
