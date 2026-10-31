import { AppointmentState } from '../../core/models/appointment.model';

/** Opciones del selector de estado, en el orden natural de una cita. */
export const APPOINTMENT_STATES: Array<{ label: string; value: AppointmentState }> = [
  { label: 'Programada', value: 'scheduled' },
  { label: 'Completada', value: 'completed' },
  { label: 'Cancelada', value: 'cancelled' },
];

export type StateSeverity = 'info' | 'success' | 'danger';

export function stateLabel(state: AppointmentState): string {
  return APPOINTMENT_STATES.find((option) => option.value === state)?.label ?? state;
}

/** Programada = informativa, completada = éxito, cancelada = peligro. */
export function stateSeverity(state: AppointmentState): StateSeverity {
  if (state === 'completed') {
    return 'success';
  }
  return state === 'cancelled' ? 'danger' : 'info';
}
