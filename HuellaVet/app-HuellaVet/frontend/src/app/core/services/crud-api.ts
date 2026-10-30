import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Contrato común de los recursos con CRUD completo de HuellaVet:
 *   GET /ruta · GET /ruta/:id · POST /ruta · PATCH /ruta/:id · PUT /ruta/:id ·
 *   DELETE /ruta/:id · PATCH /ruta/:id/deactivate
 *
 * Express envuelve cada respuesta en una clave que NO es uniforme (`owners`,
 * `vaccineBatches`, `pays`…). Aquí se desenvuelve, para que ningún componente
 * tenga que recordar el nombre de la clave.
 *
 * T = entidad · C = cuerpo de POST · U = cuerpo de PUT · P = cuerpo de PATCH.
 */
export abstract class CrudApi<T, C, U, P = Partial<U>> {
  protected readonly http = inject(HttpClient);
  /** Sin barra final: cada método añade la suya. */
  protected readonly base: string;

  protected constructor(
    path: string,
    private readonly listKey: string,
    private readonly itemKey: string,
  ) {
    this.base = `${environment.apiUrl}/${path}`;
  }

  list(): Observable<T[]> {
    return this.http
      .get<Record<string, T[]>>(this.base)
      .pipe(map((response) => response[this.listKey]));
  }

  get(id: number): Observable<T> {
    return this.http
      .get<Record<string, T>>(`${this.base}/${id}`)
      .pipe(map((response) => response[this.itemKey]));
  }

  create(payload: C): Observable<T> {
    return this.http
      .post<Record<string, T>>(this.base, payload)
      .pipe(map((response) => response[this.itemKey]));
  }

  /** PATCH: actualización parcial (la que usará el formulario de edición). */
  update(id: number, payload: P): Observable<T> {
    return this.http
      .patch<Record<string, T>>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response[this.itemKey]));
  }

  /** PUT: reemplazo completo. */
  replace(id: number, payload: U): Observable<T> {
    return this.http
      .put<Record<string, T>>(`${this.base}/${id}`, payload)
      .pipe(map((response) => response[this.itemKey]));
  }

  /** Baja lógica: PATCH /:id/deactivate. */
  deactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/deactivate`, {});
  }

  /** Baja física: DELETE. No se puede deshacer. */
  remove(id: number): Observable<unknown> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
