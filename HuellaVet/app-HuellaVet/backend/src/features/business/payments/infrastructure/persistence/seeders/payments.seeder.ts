import { AppointmentModel } from '../../../../appointments/infrastructure/persistence/models/appointment.model.js';
import { PaymentModel } from '../models/payment.model.js';

export async function seedPayments(): Promise<void> {
  const count = await PaymentModel.count();
  if (count > 0) {
    return;
  }

  const appointment = await AppointmentModel.findOne({ order: [['id', 'ASC']] });
  if (!appointment) {
    return;
  }

  await PaymentModel.create({
    referenceType: 'APPOINTMENT',
    referenceId: appointment.id,
    method: 'EFECTIVO',
    amount: 45000,
    date: new Date(),
    state: 'PAGADO',
  });
}
