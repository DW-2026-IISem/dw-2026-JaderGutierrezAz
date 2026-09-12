import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class VaccineBatchNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Lote de vacuna', id);
  }
}
