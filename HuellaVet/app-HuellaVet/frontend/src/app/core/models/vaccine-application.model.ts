import { Timestamps } from './api.model';

/** Tabla `vaccine_applications` — /api/aplicaciones-vacunas. Une una consulta con un lote. */
export interface VaccineApplication extends Timestamps {
  id: number;
  consultation_id: number;
  vaccine_batch_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface VaccineApplicationCreate {
  consultation_id: number;
  vaccine_batch_id: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export interface VaccineApplicationUpdate {
  consultation_id: number;
  vaccine_batch_id: number;
  name: string;
  description?: string | null;
}
