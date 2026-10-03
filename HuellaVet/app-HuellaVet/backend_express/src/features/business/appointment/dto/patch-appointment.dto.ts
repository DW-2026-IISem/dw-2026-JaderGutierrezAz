import { UpdateAppointmentDto } from "./update-appointment.dto";
import { AppointmentState } from "../appointment.model";

/**
 * Datos de entrada de `PATCH /api/citas/:id` (actualización parcial).
 * A diferencia del resto de entidades (donde el estado solo cambia con
 * `/deactivate`), aquí `state` SÍ puede llegar por PATCH: marcar una cita como
 * "completed" es una acción de negocio legítima, distinta de cancelarla.
 */
export type PatchAppointmentDto = Partial<UpdateAppointmentDto> & {
  state?: AppointmentState;
};
