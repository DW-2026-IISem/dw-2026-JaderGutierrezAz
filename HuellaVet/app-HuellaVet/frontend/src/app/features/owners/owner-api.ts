import { Injectable } from '@angular/core';
import { Owner, OwnerCreate, OwnerUpdate } from '../../core/models/owner.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/propietarios — la lista llega en `owners`. */
@Injectable({ providedIn: 'root' })
export class OwnerApi extends CrudApi<Owner, OwnerCreate, OwnerUpdate> {
  constructor() {
    super('propietarios', 'owners', 'owner');
  }
}
