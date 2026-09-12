import { AppointmentModel } from '../../../../appointments/infrastructure/persistence/models/appointment.model.js';
import { ConsultationModel } from '../models/consultation.model.js';

export async function seedConsultations(): Promise<void> {
  const count = await ConsultationModel.count();
  if (count > 0) {
    return;
  }

  const appointment = await AppointmentModel.findOne({ order: [['id', 'ASC']] });
  if (!appointment) {
    return;
  }

  await ConsultationModel.create({
    appointmentId: appointment.id,
    name: 'Consulta general',
    description: 'Revisión de rutina derivada de la cita',
    isActive: true,
  });
}
