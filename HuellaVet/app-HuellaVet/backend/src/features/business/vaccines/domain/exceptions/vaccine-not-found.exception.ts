import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class VaccineNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Vacuna', id);
  }
}
