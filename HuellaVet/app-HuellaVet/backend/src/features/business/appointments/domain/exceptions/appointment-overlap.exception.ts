import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class AppointmentOverlapException extends DomainException {
  constructor(veterinarianId: number) {
    super(
      `El veterinario ${veterinarianId} ya tiene una cita agendada en ese horario`,
    );
  }
}
