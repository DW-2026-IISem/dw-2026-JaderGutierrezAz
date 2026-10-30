import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { EffectivePermission, PermissionsPayload } from '../../../core/models/auth.model';
import { ChangePassword, User, UserCreate, UserUpdate } from '../../../core/models/user.model';
import { CrudApi } from '../../../core/services/crud-api';

/** /api/usuarios — la lista llega en `users`. */
@Injectable({ providedIn: 'root' })
export class UserApi extends CrudApi<User, UserCreate, UserUpdate> {
  constructor() {
    super('usuarios', 'users', 'user');
  }

  /** GET /api/usuarios/:id/permisos: permisos efectivos del usuario (envueltos en `permissions`). */
  permissions(id: number): Observable<EffectivePermission[]> {
    return this.http
      .get<PermissionsPayload>(`${this.base}/${id}/permisos`)
      .pipe(map((response) => response.permissions));
  }

  /** PATCH /api/usuarios/:id/password: exige la contraseña actual. */
  changePassword(id: number, payload: ChangePassword): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/password`, payload);
  }
}
