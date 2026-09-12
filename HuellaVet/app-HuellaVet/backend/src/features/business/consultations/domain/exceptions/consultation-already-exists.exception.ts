import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class ConsultationAlreadyExistsException extends DomainException {
  constructor(appointmentId: number) {
    super(`La cita ${appointmentId} ya tiene una consulta registrada`);
  }
}
