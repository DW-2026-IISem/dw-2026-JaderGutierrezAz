import { Module } from '@nestjs/common';
import { VACCINE_REPOSITORY } from './domain/interfaces/vaccine-repository.interface.js';
import { VaccineRepository } from './infrastructure/persistence/repositories/vaccine.repository.js';
import { CreateVaccineUseCase } from './application/use-cases/create-vaccine.use-case.js';
import { UpdateVaccineUseCase } from './application/use-cases/update-vaccine.use-case.js';
import { DeleteVaccineUseCase } from './application/use-cases/delete-vaccine.use-case.js';
import { GetVaccineUseCase } from './application/use-cases/get-vaccine.use-case.js';
import { ListVaccinesUseCase } from './application/use-cases/list-vaccines.use-case.js';
import { VaccinesController } from './presentation/http/controllers/vaccines.controller.js';

@Module({
  controllers: [VaccinesController],
  providers: [
    VaccineRepository,
    { provide: VACCINE_REPOSITORY, useExisting: VaccineRepository },
    CreateVaccineUseCase,
    UpdateVaccineUseCase,
    DeleteVaccineUseCase,
    GetVaccineUseCase,
    ListVaccinesUseCase,
  ],
  exports: [VACCINE_REPOSITORY],
})
export class VaccinesModule {}
