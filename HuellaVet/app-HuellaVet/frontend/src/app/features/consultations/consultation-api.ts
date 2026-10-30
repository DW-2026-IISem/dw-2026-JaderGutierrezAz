import { Injectable } from '@angular/core';
import {
  Consultation,
  ConsultationCreate,
  ConsultationUpdate,
} from '../../core/models/consultation.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/consultas — la lista llega en `consultations`. */
@Injectable({ providedIn: 'root' })
export class ConsultationApi extends CrudApi<Consultation, ConsultationCreate, ConsultationUpdate> {
  constructor() {
    super('consultas', 'consultations', 'consultation');
  }
}
