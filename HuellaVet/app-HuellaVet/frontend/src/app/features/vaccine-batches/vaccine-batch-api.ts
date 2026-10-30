import { Injectable } from '@angular/core';
import {
  VaccineBatch,
  VaccineBatchCreate,
  VaccineBatchUpdate,
} from '../../core/models/vaccine-batch.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/lotes-vacunas — OJO: la lista llega en `vaccineBatches` (camelCase). */
@Injectable({ providedIn: 'root' })
export class VaccineBatchApi extends CrudApi<VaccineBatch, VaccineBatchCreate, VaccineBatchUpdate> {
  constructor() {
    super('lotes-vacunas', 'vaccineBatches', 'vaccineBatch');
  }
}
