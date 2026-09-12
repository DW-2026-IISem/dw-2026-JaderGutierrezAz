import { PetModel } from '../../../../pets/infrastructure/persistence/models/pet.model.js';
import { VeterinarianModel } from '../../../../veterinarians/infrastructure/persistence/models/veterinarian.model.js';
import { AppointmentModel } from '../models/appointment.model.js';

export async function seedAppointments(): Promise<void> {
  const count = await AppointmentModel.count();
  if (count > 0) {
    return;
  }

  const pets = await PetModel.findAll({ limit: 2, order: [['id', 'ASC']] });
  const veterinarians = await VeterinarianModel.findAll({
    limit: 2,
    order: [['id', 'ASC']],
  });

  if (pets.length === 0 || veterinarians.length === 0) {
    return;
  }

  const now = new Date();
  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);

  await AppointmentModel.bulkCreate([
    {
      petId: pets[0].id,
      veterinarianId: veterinarians[0].id,
      startDate: now,
      endDate: inOneHour,
      reason: 'Control preventivo',
      state: 'PENDIENTE',
    },
  ]);
}
