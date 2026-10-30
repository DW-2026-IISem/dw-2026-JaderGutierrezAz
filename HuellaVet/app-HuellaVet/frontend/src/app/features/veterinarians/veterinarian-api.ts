import { Injectable } from '@angular/core';
import {
  Veterinarian,
  VeterinarianCreate,
  VeterinarianUpdate,
} from '../../core/models/veterinarian.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/veterinarios — la lista llega en `veterinarians`. */
@Injectable({ providedIn: 'root' })
export class VeterinarianApi extends CrudApi<Veterinarian, VeterinarianCreate, VeterinarianUpdate> {
  constructor() {
    super('veterinarios', 'veterinarians', 'veterinarian');
  }
}
