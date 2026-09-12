import { Module } from '@nestjs/common';
import { OwnersModule } from '../owners/owners.module.js';
import { PET_REPOSITORY } from './domain/interfaces/pet-repository.interface.js';
import { PetRepository } from './infrastructure/persistence/repositories/pet.repository.js';
import { CreatePetUseCase } from './application/use-cases/create-pet.use-case.js';
import { UpdatePetUseCase } from './application/use-cases/update-pet.use-case.js';
import { DeletePetUseCase } from './application/use-cases/delete-pet.use-case.js';
import { GetPetUseCase } from './application/use-cases/get-pet.use-case.js';
import { ListPetsUseCase } from './application/use-cases/list-pets.use-case.js';
import { PetsController } from './presentation/http/controllers/pets.controller.js';

@Module({
  imports: [OwnersModule],
  controllers: [PetsController],
  providers: [
    PetRepository,
    { provide: PET_REPOSITORY, useExisting: PetRepository },
    CreatePetUseCase,
    UpdatePetUseCase,
    DeletePetUseCase,
    GetPetUseCase,
    ListPetsUseCase,
  ],
  exports: [PET_REPOSITORY],
})
export class PetsModule {}
