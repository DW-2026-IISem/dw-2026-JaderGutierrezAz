/** Estado de las entidades de seguridad (users, roles, recursos y pivotes). */
export type Status = 'active' | 'inactive';

/** DECIMAL(10,2) llega como string ("12.50"). Se muestra tal cual y se opera con toNumber(). */
export type Money = string;

/** Verbos de `resources.method`. */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Firma mínima de los objetos Sequelize que devuelve el backend. */
export interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}

/** Cuerpo de error de Express: `{ error }` y, a veces, `{ detail }`. */
export interface ApiError {
  error: string;
  detail?: string;
}

/** Importe a número, para sumar o comparar. Un valor no numérico cuenta como 0. */
export function toNumber(value: Money | number | null | undefined): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}
