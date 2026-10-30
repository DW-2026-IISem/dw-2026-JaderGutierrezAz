import { HttpMethod, Status, Timestamps } from './api.model';

/** Pivote `resource_roles` — /api/concesiones-rol. Cada fila ES un permiso. La lista llega en `grants`. */
export interface ResourceRole extends Timestamps {
  id: number;
  role_id: number;
  resource_id: number;
  status: Status;
  /** Relaciones incluidas (campos a confirmar con la verificación). */
  role?: { id: number; name: string } | null;
  resource?: {
    id: number;
    method: HttpMethod;
    path: string;
    description: string | null;
  } | null;
}

/** SUPUESTO: confirmar con create-resource-role.dto.ts. */
export interface ResourceRoleCreate {
  role_id: number;
  resource_id: number;
  status?: Status;
}
