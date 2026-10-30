import { Injectable } from '@angular/core';
import { Vaccine, VaccineCreate, VaccineUpdate } from '../../core/models/vaccine.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/vacunas — la lista llega en `vaccines`. */
@Injectable({ providedIn: 'root' })
export class VaccineApi extends CrudApi<Vaccine, VaccineCreate, VaccineUpdate> {
  constructor() {
    super('vacunas', 'vaccines', 'vaccine');
  }
}
