import { VeterinarianModel } from '../models/veterinarian.model.js';

export async function seedVeterinarians(): Promise<void> {
  const count = await VeterinarianModel.count();
  if (count > 0) {
    return;
  }

  await VeterinarianModel.bulkCreate([
    {
      name: 'Dra. Ana Martínez',
      description: 'Medicina general y vacunación',
      isActive: true,
    },
    {
      name: 'Dr. Julián Rojas',
      description: 'Cirugía y control preventivo',
      isActive: true,
    },
  ]);
}
