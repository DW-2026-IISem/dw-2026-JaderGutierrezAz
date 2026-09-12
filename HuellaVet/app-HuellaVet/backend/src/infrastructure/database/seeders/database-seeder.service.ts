import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { seedOwners } from '../../../features/business/owners/infrastructure/persistence/seeders/owners.seeder.js';
import { seedPets } from '../../../features/business/pets/infrastructure/persistence/seeders/pets.seeder.js';
import { seedVeterinarians } from '../../../features/business/veterinarians/infrastructure/persistence/seeders/veterinarians.seeder.js';
import { seedAppointments } from '../../../features/business/appointments/infrastructure/persistence/seeders/appointments.seeder.js';
import { seedConsultations } from '../../../features/business/consultations/infrastructure/persistence/seeders/consultations.seeder.js';
import { seedVaccines } from '../../../features/business/vaccines/infrastructure/persistence/seeders/vaccines.seeder.js';
import { seedVaccineBatches } from '../../../features/business/vaccine-batches/infrastructure/persistence/seeders/vaccine-batches.seeder.js';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeederService.name);

  async onModuleInit(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    try {
      await seedOwners();
      await seedPets();
      await seedVeterinarians();
      await seedAppointments();
      await seedConsultations();
      await seedVaccines();
      await seedVaccineBatches();
      this.logger.log('✅ Seeders ejecutados');
    } catch (error: any) {
      this.logger.error(`❌ Error en seeders: ${error.message}`, error.stack);
      throw error;
    }
  }
}
