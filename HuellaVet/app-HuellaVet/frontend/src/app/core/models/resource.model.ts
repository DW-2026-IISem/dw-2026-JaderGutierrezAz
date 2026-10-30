import { HttpMethod, Status, Timestamps } from './api.model';

/** Tabla `resources` — /api/recursos. Catálogo de pares (method, path); tu backend tiene 103. */
export interface Resource extends Timestamps {
  id: number;
  method: HttpMethod;
  path: string;
  description: string | null;
  status: Status;
}

/** SUPUESTO: confirmar con create-resource.dto.ts antes de ISS-10. */
export interface ResourceCreate {
  method: HttpMethod;
  path: string;
  description?: string | null;
  status?: Status;
}

/** SUPUESTO: confirmar con update-resource.dto.ts. */
export interface ResourceUpdate {
  method: HttpMethod;
  path: string;
  description?: string | null;
}
