import { Injectable } from '@angular/core';
import { Role, RoleCreate, RoleUpdate } from '../../../core/models/role.model';
import { CrudApi } from '../../../core/services/crud-api';

/** /api/roles — la lista llega en `roles`. */
@Injectable({ providedIn: 'root' })
export class RoleApi extends CrudApi<Role, RoleCreate, RoleUpdate> {
  constructor() {
    super('roles', 'roles', 'role');
  }
}
