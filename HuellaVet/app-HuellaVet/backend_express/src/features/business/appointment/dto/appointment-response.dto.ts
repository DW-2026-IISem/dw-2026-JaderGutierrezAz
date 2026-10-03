import { Appointment, AppointmentI } from "../appointment.model";

/** Respuesta HTTP de una cita. */
export type AppointmentResponseDto = AppointmentI;

/** Mapper modelo -> DTO de respuesta. */
export function toAppointmentResponse(appointment: Appointment): AppointmentResponseDto {
  return appointment.toJSON() as AppointmentI;
}
