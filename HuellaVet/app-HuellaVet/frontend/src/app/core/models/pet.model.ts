import { Timestamps } from './api.model';

/** Tabla `pets` — /api/mascotas. Pertenece a un propietario. */
export interface Pet extends Timestamps {
  id: number;
  owner_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface PetCreate {
  owner_id: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export interface PetUpdate {
  owner_id: number;
  name: string;
  description?: string | null;
}
