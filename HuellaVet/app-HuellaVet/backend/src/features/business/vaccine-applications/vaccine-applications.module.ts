import { Module } from '@nestjs/common';
import { ConsultationsModule } from '../consultations/consultations.module.js';
import { VaccineBatchesModule } from '../vaccine-batches/vaccine-batches.module.js';
import { VACCINE_APPLICATION_REPOSITORY } from './domain/interfaces/vaccine-application-repository.interface.js';
import { VaccineApplicationRepository } from './infrastructure/persistence/repositories/vaccine-application.repository.js';
import { CreateVaccineApplicationUseCase } from './application/use-cases/create-vaccine-application.use-case.js';
import { UpdateVaccineApplicationUseCase } from './application/use-cases/update-vaccine-application.use-case.js';
import { DeleteVaccineApplicationUseCase } from './application/use-cases/delete-vaccine-application.use-case.js';
import { GetVaccineApplicationUseCase } from './application/use-cases/get-vaccine-application.use-case.js';
import { ListVaccineApplicationsUseCase } from './application/use-cases/list-vaccine-applications.use-case.js';
import { VaccineApplicationsController } from './presentation/http/controllers/vaccine-applications.controller.js';

@Module({
  imports: [ConsultationsModule, VaccineBatchesModule],
  controllers: [VaccineApplicationsController],
  providers: [
    VaccineApplicationRepository,
    {
      provide: VACCINE_APPLICATION_REPOSITORY,
      useExisting: VaccineApplicationRepository,
    },
    CreateVaccineApplicationUseCase,
    UpdateVaccineApplicationUseCase,
    DeleteVaccineApplicationUseCase,
    GetVaccineApplicationUseCase,
    ListVaccineApplicationsUseCase,
  ],
  exports: [VACCINE_APPLICATION_REPOSITORY],
})
export class VaccineApplicationsModule {}
