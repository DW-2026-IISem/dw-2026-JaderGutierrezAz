import { Module } from '@nestjs/common';
import { VETERINARIAN_REPOSITORY } from './domain/interfaces/veterinarian-repository.interface.js';
import { VeterinarianRepository } from './infrastructure/persistence/repositories/veterinarian.repository.js';
import { CreateVeterinarianUseCase } from './application/use-cases/create-veterinarian.use-case.js';
import { UpdateVeterinarianUseCase } from './application/use-cases/update-veterinarian.use-case.js';
import { DeleteVeterinarianUseCase } from './application/use-cases/delete-veterinarian.use-case.js';
import { GetVeterinarianUseCase } from './application/use-cases/get-veterinarian.use-case.js';
import { ListVeterinariansUseCase } from './application/use-cases/list-veterinarians.use-case.js';
import { VeterinariansController } from './presentation/http/controllers/veterinarians.controller.js';

@Module({
  controllers: [VeterinariansController],
  providers: [
    VeterinarianRepository,
    { provide: VETERINARIAN_REPOSITORY, useExisting: VeterinarianRepository },
    CreateVeterinarianUseCase,
    UpdateVeterinarianUseCase,
    DeleteVeterinarianUseCase,
    GetVeterinarianUseCase,
    ListVeterinariansUseCase,
  ],
  exports: [VETERINARIAN_REPOSITORY],
})
export class VeterinariansModule {}
