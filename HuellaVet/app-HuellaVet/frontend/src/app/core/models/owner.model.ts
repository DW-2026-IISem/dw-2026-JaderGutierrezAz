import { Timestamps } from './api.model';

/** Tabla `owners` — /api/propietarios */
export interface Owner extends Timestamps {
  id: number;
  document_type: string;
  /** Único. */
  document_number: string;
  name: string;
  phone: string | null;
  /** Único. */
  email: string | null;
  is_active: boolean;
}

/** Cuerpo de `POST`. `is_active` es opcional (por defecto true). */
export interface OwnerCreate {
  document_type: string;
  document_number: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  is_active?: boolean;
}

/** Cuerpo de `PUT` (reemplazo completo) y base del `PATCH`. `is_active` NO viaja: solo cambia con /deactivate. */
export interface OwnerUpdate {
  document_type: string;
  document_number: string;
  name: string;
  phone?: string | null;
  email?: string | null;
}
