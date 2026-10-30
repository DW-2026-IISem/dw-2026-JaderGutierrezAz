import { Timestamps } from './api.model';

/** Tabla `veterinarians` — /api/veterinarios */
export interface Veterinarian extends Timestamps {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface VeterinarianCreate {
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export interface VeterinarianUpdate {
  name: string;
  description?: string | null;
}
