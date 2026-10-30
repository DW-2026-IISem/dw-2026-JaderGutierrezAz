import { Timestamps } from './api.model';

/** Tabla `vaccines` — /api/vacunas */
export interface Vaccine extends Timestamps {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface VaccineCreate {
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export interface VaccineUpdate {
  name: string;
  description?: string | null;
}
