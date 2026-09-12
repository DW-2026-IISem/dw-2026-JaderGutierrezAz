import { Module } from '@nestjs/common';
import { OwnersModule } from './owners/owners.module.js';
import { PetsModule } from './pets/pets.module.js';

@Module({
  imports: [OwnersModule, PetsModule],
  exports: [OwnersModule, PetsModule],
})
export class BusinessModule {}
