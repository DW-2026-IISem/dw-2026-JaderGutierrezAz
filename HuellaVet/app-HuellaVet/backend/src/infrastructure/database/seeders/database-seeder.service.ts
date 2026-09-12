import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { seedOwners } from '../../../features/business/owners/infrastructure/persistence/seeders/owners.seeder.js';
import { seedPets } from '../../../features/business/pets/infrastructure/persistence/seeders/pets.seeder.js';
import { seedVeterinarians } from '../../../features/business/veterinarians/infrastructure/persistence/seeders/veterinarians.seeder.js';

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
      this.logger.log('✅ Seeders ejecutados');
    } catch (error: any) {
      this.logger.error(`❌ Error en seeders: ${error.message}`, error.stack);
      throw error;
    }
  }
}
