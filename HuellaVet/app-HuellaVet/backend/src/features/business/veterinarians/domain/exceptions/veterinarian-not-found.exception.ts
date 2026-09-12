import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class VeterinarianNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Veterinario', id);
  }
}
