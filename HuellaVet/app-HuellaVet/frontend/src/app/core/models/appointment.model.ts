import { Timestamps } from './api.model';

export type AppointmentState = 'scheduled' | 'completed' | 'cancelled';

/** Tabla `appointments` — /api/citas. Usa `state`, no `is_active`. Las fechas son ISO-8601. */
export interface Appointment extends Timestamps {
  id: number;
  pet_id: number;
  veterinarian_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  state: AppointmentState;
}

/** Cuerpo de `POST`. `state` es opcional (por defecto 'scheduled'). */
export interface AppointmentCreate {
  pet_id: number;
  veterinarian_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  state?: AppointmentState;
}

/** Cuerpo de `PUT`: reprogramar no cambia el estado por sí solo. */
export interface AppointmentUpdate {
  pet_id: number;
  veterinarian_id: number;
  start_date: string;
  end_date: string;
  reason: string;
}

/** Cuerpo de `PATCH`: aquí `state` SÍ puede viajar (marcar una cita como 'completed' es una acción de negocio). */
export type AppointmentPatch = Partial<AppointmentUpdate> & { state?: AppointmentState };
