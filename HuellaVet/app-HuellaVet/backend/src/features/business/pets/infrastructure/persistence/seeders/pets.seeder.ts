import { OwnerModel } from '../../../../owners/infrastructure/persistence/models/owner.model.js';
import { PetModel } from '../models/pet.model.js';

export async function seedPets(): Promise<void> {
  const count = await PetModel.count();
  if (count > 0) {
    return;
  }

  const owners = await OwnerModel.findAll({ limit: 2, order: [['id', 'ASC']] });
  if (owners.length === 0) {
    return;
  }

  await PetModel.bulkCreate([
    {
      ownerId: owners[0].id,
      name: 'Firulais',
      description: 'Perro criollo, 3 años',
      isActive: true,
    },
    {
      ownerId: owners[owners.length > 1 ? 1 : 0].id,
      name: 'Michi',
      description: 'Gato mestizo, 1 año',
      isActive: true,
    },
  ]);
}
