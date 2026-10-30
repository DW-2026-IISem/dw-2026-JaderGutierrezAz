import { Injectable } from '@angular/core';
import { Resource, ResourceCreate, ResourceUpdate } from '../../../core/models/resource.model';
import { CrudApi } from '../../../core/services/crud-api';

/** /api/recursos — la lista llega en `resources`. */
@Injectable({ providedIn: 'root' })
export class ResourceApi extends CrudApi<Resource, ResourceCreate, ResourceUpdate> {
  constructor() {
    super('recursos', 'resources', 'resource');
  }
}
