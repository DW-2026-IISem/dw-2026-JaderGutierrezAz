import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class VaccineApplicationNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Aplicación de vacuna', id);
  }
}
