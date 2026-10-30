import { Status, Timestamps } from './api.model';

/** Pivote `role_users` — /api/asignaciones-rol. La lista llega envuelta en `assignments`. */
export interface RoleUser extends Timestamps {
  id: number;
  user_id: number;
  role_id: number;
  status: Status;
  /** Relaciones incluidas (campos a confirmar con la verificación). */
  user?: { id: number; username: string; email: string } | null;
  role?: { id: number; name: string } | null;
}

/** SUPUESTO: confirmar con create-role-user.dto.ts. */
export interface RoleUserCreate {
  user_id: number;
  role_id: number;
  status?: Status;
}
