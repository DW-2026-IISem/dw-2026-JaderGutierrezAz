import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class OwnerNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Propietario', id);
  }
}
