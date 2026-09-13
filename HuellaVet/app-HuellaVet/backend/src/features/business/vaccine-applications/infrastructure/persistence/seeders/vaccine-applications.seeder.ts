import { ConsultationModel } from '../../../../consultations/infrastructure/persistence/models/consultation.model.js';
import { VaccineBatchModel } from '../../../../vaccine-batches/infrastructure/persistence/models/vaccine-batch.model.js';
import { VaccineApplicationModel } from '../models/vaccine-application.model.js';

export async function seedVaccineApplications(): Promise<void> {
  const count = await VaccineApplicationModel.count();
  if (count > 0) {
    return;
  }

  const consultation = await ConsultationModel.findOne({ order: [['id', 'ASC']] });
  const vaccineBatch = await VaccineBatchModel.findOne({ order: [['id', 'ASC']] });

  if (!consultation || !vaccineBatch) {
    return;
  }

  await VaccineApplicationModel.create({
    consultationId: consultation.id,
    vaccineBatchId: vaccineBatch.id,
    name: 'Aplicación antirrábica inicial',
    description: 'Primera dosis aplicada durante la consulta',
    isActive: true,
  });
}
