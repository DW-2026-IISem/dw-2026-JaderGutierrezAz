import { Injectable } from '@angular/core';
import { Pet, PetCreate, PetUpdate } from '../../core/models/pet.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/mascotas — la lista llega en `pets`. */
@Injectable({ providedIn: 'root' })
export class PetApi extends CrudApi<Pet, PetCreate, PetUpdate> {
  constructor() {
    super('mascotas', 'pets', 'pet');
  }
}
