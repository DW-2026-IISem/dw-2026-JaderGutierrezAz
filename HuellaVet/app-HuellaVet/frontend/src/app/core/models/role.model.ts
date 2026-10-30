import { Status, Timestamps } from './api.model';

/** Tabla `roles` — /api/roles. El nombre del rol no autoriza nada por sí solo. */
export interface Role extends Timestamps {
  id: number;
  name: string;
  description: string | null;
  status: Status;
}

/** SUPUESTO: confirmar con create-role.dto.ts antes de ISS-10. */
export interface RoleCreate {
  name: string;
  description?: string | null;
  status?: Status;
}

/** SUPUESTO: confirmar con update-role.dto.ts. */
export interface RoleUpdate {
  name: string;
  description?: string | null;
}
