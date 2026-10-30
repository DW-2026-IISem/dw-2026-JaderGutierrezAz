import { Timestamps } from './api.model';

/** Tabla `consultations` — /api/consultas. Una cita tiene como máximo una consulta. */
export interface Consultation extends Timestamps {
  id: number;
  appointment_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface ConsultationCreate {
  appointment_id: number;
  name: string;
  description?: string | null;
  is_active?: boolean;
}

export interface ConsultationUpdate {
  appointment_id: number;
  name: string;
  description?: string | null;
}
