import { Module } from '@nestjs/common';
import { OwnersModule } from './owners/owners.module.js';
import { PetsModule } from './pets/pets.module.js';
import { VeterinariansModule } from './veterinarians/veterinarians.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { ConsultationsModule } from './consultations/consultations.module.js';
import { VaccinesModule } from './vaccines/vaccines.module.js';
import { VaccineBatchesModule } from './vaccine-batches/vaccine-batches.module.js';

@Module({
  imports: [
    OwnersModule,
    PetsModule,
    VeterinariansModule,
    AppointmentsModule,
    ConsultationsModule,
    VaccinesModule,
    VaccineBatchesModule,
  ],
  exports: [
    OwnersModule,
    PetsModule,
    VeterinariansModule,
    AppointmentsModule,
    ConsultationsModule,
    VaccinesModule,
    VaccineBatchesModule,
  ],
})
export class BusinessModule {}
