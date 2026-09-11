import { OwnerModel } from '../models/owner.model.js';

export async function seedOwners(): Promise<void> {
  const count = await OwnerModel.count();
  if (count > 0) {
    return;
  }

  await OwnerModel.bulkCreate([
    {
      documentType: 'CC',
      documentNumber: '1001234567',
      name: 'Laura Gómez',
      phone: '+57 300 1234567',
      email: 'laura.gomez@example.com',
      isActive: true,
    },
    {
      documentType: 'CC',
      documentNumber: '1009876543',
      name: 'Carlos Pérez',
      phone: '+57 310 9876543',
      email: 'carlos.perez@example.com',
      isActive: true,
    },
  ]);
}
