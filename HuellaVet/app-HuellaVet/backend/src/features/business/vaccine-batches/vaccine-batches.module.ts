import { Module } from '@nestjs/common';
import { VaccinesModule } from '../vaccines/vaccines.module.js';
import { VACCINE_BATCH_REPOSITORY } from './domain/interfaces/vaccine-batch-repository.interface.js';
import { VaccineBatchRepository } from './infrastructure/persistence/repositories/vaccine-batch.repository.js';
import { CreateVaccineBatchUseCase } from './application/use-cases/create-vaccine-batch.use-case.js';
import { UpdateVaccineBatchUseCase } from './application/use-cases/update-vaccine-batch.use-case.js';
import { DeleteVaccineBatchUseCase } from './application/use-cases/delete-vaccine-batch.use-case.js';
import { GetVaccineBatchUseCase } from './application/use-cases/get-vaccine-batch.use-case.js';
import { ListVaccineBatchesUseCase } from './application/use-cases/list-vaccine-batches.use-case.js';
import { VaccineBatchesController } from './presentation/http/controllers/vaccine-batches.controller.js';

@Module({
  imports: [VaccinesModule],
  controllers: [VaccineBatchesController],
  providers: [
    VaccineBatchRepository,
    { provide: VACCINE_BATCH_REPOSITORY, useExisting: VaccineBatchRepository },
    CreateVaccineBatchUseCase,
    UpdateVaccineBatchUseCase,
    DeleteVaccineBatchUseCase,
    GetVaccineBatchUseCase,
    ListVaccineBatchesUseCase,
  ],
  exports: [VACCINE_BATCH_REPOSITORY],
})
export class VaccineBatchesModule {}
