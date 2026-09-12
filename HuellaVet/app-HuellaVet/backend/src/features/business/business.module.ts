import { Module } from '@nestjs/common';
import { OwnersModule } from './owners/owners.module.js';
import { PetsModule } from './pets/pets.module.js';
import { VeterinariansModule } from './veterinarians/veterinarians.module.js';

@Module({
  imports: [OwnersModule, PetsModule, VeterinariansModule],
  exports: [OwnersModule, PetsModule, VeterinariansModule],
})
export class BusinessModule {}
