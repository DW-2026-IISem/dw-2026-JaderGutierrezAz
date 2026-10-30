import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RoleUser, RoleUserCreate } from '../../../core/models/role-user.model';

/**
 * /api/asignaciones-rol — la lista llega en `assignments` (NO `role_users`).
 * No hay PATCH, PUT ni DELETE: retirar es baja lógica y volver a dar es reactivar.
 */
@Injectable({ providedIn: 'root' })
export class RoleUserApi {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/asignaciones-rol`;

  list(): Observable<RoleUser[]> {
    return this.http
      .get<{ assignments: RoleUser[] }>(this.base)
      .pipe(map((response) => response.assignments));
  }

  get(id: number): Observable<RoleUser> {
    return this.http
      .get<{ assignment: RoleUser }>(`${this.base}/${id}`)
      .pipe(map((response) => response.assignment));
  }

  create(payload: RoleUserCreate): Observable<RoleUser> {
    return this.http
      .post<{ assignment: RoleUser }>(this.base, payload)
      .pipe(map((response) => response.assignment));
  }

  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  reactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/reactivate`, {});
  }
}
