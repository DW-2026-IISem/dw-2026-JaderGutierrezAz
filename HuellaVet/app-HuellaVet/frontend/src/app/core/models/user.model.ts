import { Status, Timestamps } from './api.model';

/** Tabla `users` — /api/usuarios. La respuesta nunca trae `password`. */
export interface User extends Timestamps {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  status: Status;
}

/** Cuerpo de `POST`. `password` es obligatorio al crear. `avatar` se supone (confirmar con el DTO). */
export interface UserCreate {
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  status?: Status;
}

/** Cuerpo de `PUT`/`PATCH`: ni `password` (tiene su operación) ni `status` (solo /deactivate). */
export interface UserUpdate {
  username: string;
  email: string;
  avatar?: string | null;
}

/** Cuerpo de `PATCH /api/usuarios/:id/password`. */
export interface ChangePassword {
  current_password: string;
  new_password: string;
}
