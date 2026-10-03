import { AppointmentState } from "../appointment.model";

/** Datos de entrada de `POST /api/citas`. */
export interface CreateAppointmentDto {
  pet_id: number;
  veterinarian_id: number;
  start_date: Date;
  end_date: Date;
  reason: string;
  state?: AppointmentState;
}
