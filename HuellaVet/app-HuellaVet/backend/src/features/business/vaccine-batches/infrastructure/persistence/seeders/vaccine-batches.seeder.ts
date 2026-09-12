import { VaccineModel } from '../../../../vaccines/infrastructure/persistence/models/vaccine.model.js';
import { VaccineBatchModel } from '../models/vaccine-batch.model.js';

export async function seedVaccineBatches(): Promise<void> {
  const count = await VaccineBatchModel.count();
  if (count > 0) {
    return;
  }

  const vaccines = await VaccineModel.findAll({ limit: 2, order: [['id', 'ASC']] });
  if (vaccines.length === 0) {
    return;
  }

  await VaccineBatchModel.bulkCreate([
    {
      vaccineId: vaccines[0].id,
      name: 'Lote A-2026-01',
      description: 'Primer lote del año, laboratorio Zoetis',
      isActive: true,
    },
    {
      vaccineId: vaccines[vaccines.length > 1 ? 1 : 0].id,
      name: 'Lote B-2026-01',
      description: 'Lote de refuerzo, laboratorio MSD',
      isActive: true,
    },
  ]);
}
