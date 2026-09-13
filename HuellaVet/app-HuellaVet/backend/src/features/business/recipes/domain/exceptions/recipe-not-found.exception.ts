import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class RecipeNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super('Receta', id);
  }
}
