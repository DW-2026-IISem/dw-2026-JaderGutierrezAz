import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class ConsultationNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Consulta', id);
  }
}
