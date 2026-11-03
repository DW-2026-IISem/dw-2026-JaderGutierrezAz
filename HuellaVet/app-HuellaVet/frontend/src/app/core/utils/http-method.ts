import { HttpMethod } from '../models/api.model';

export type MethodSeverity = 'info' | 'success' | 'warn' | 'danger' | 'secondary';

/** Color de la etiqueta de un método HTTP en las tablas de recursos y concesiones. */
export function methodSeverity(method: HttpMethod | string | undefined): MethodSeverity {
  switch (method) {
    case 'GET':
      return 'info';
    case 'POST':
      return 'success';
    case 'PUT':
    case 'PATCH':
      return 'warn';
    case 'DELETE':
      return 'danger';
    default:
      return 'secondary';
  }
}
