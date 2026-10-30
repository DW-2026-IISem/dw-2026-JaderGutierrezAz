import { Timestamps } from './api.model';

/** Tabla `vaccine_batches` — /api/lotes-vacunas. Un lote pertenece a una vacuna. */
export interface VaccineBatch extends Timestamps {
  id: number;
  vaccine_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface VaccineBatchCreate {
  vaccine_id: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export interface VaccineBatchUpdate {
  vaccine_id: number;
  name: string;
  description?: string | null;
}
