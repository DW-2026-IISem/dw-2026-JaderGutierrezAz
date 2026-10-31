import { Appointment } from '../../core/models/appointment.model';

/** Lo mínimo de una cita para comprobar un solape: no importa si ya existe o es nueva. */
export interface Slot {
  veterinarian_id: number;
  start_date: string;
  end_date: string;
}

/**
 * Devuelve la cita existente con la que `candidate` se solapa, o `null`.
 *
 * Regla de negocio: un veterinario no puede tener dos citas que se solapen. Aquí
 * es una ayuda preventiva; el backend sigue siendo la autoridad. Las citas
 * canceladas no ocupan horario (supuesto: se confirma contra el backend en 6.9).
 * Dos citas pegadas (una termina cuando empieza la otra) NO se solapan.
 */
export function findOverlap(
  candidate: Slot,
  existing: readonly Appointment[],
  ignoreId?: number,
): Appointment | null {
  const start = Date.parse(candidate.start_date);
  const end = Date.parse(candidate.end_date);

  return (
    existing.find(
      (other) =>
        other.id !== ignoreId &&
        other.veterinarian_id === candidate.veterinarian_id &&
        other.state !== 'cancelled' &&
        start < Date.parse(other.end_date) &&
        Date.parse(other.start_date) < end,
    ) ?? null
  );
}
