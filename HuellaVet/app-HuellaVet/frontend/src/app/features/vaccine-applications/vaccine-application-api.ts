import { Injectable } from '@angular/core';
import {
  VaccineApplication,
  VaccineApplicationCreate,
  VaccineApplicationUpdate,
} from '../../core/models/vaccine-application.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/aplicaciones-vacunas — OJO: la lista llega en `vaccineApplications` (camelCase). */
@Injectable({ providedIn: 'root' })
export class VaccineApplicationApi extends CrudApi<
  VaccineApplication,
  VaccineApplicationCreate,
  VaccineApplicationUpdate
> {
  constructor() {
    super('aplicaciones-vacunas', 'vaccineApplications', 'vaccineApplication');
  }
}
