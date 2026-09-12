import { VaccineModel } from '../models/vaccine.model.js';

export async function seedVaccines(): Promise<void> {
  const count = await VaccineModel.count();
  if (count > 0) {
    return;
  }

  await VaccineModel.bulkCreate([
    {
      name: 'Antirrábica',
      description: 'Prevención de rabia canina y felina',
      isActive: true,
    },
    {
      name: 'Polivalente',
      description: 'Prevención de moquillo, parvovirus y hepatitis',
      isActive: true,
    },
  ]);
}
