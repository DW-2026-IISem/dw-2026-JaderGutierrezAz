import { Module } from '@nestjs/common';
import { OWNER_REPOSITORY } from './domain/interfaces/owner-repository.interface.js';
import { OwnerRepository } from './infrastructure/persistence/repositories/owner.repository.js';
import { CreateOwnerUseCase } from './application/use-cases/create-owner.use-case.js';
import { UpdateOwnerUseCase } from './application/use-cases/update-owner.use-case.js';
import { DeleteOwnerUseCase } from './application/use-cases/delete-owner.use-case.js';
import { GetOwnerUseCase } from './application/use-cases/get-owner.use-case.js';
import { ListOwnersUseCase } from './application/use-cases/list-owners.use-case.js';
import { OwnersController } from './presentation/http/controllers/owners.controller.js';

@Module({
  controllers: [OwnersController],
  providers: [
    OwnerRepository,
    { provide: OWNER_REPOSITORY, useExisting: OwnerRepository },
    CreateOwnerUseCase,
    UpdateOwnerUseCase,
    DeleteOwnerUseCase,
    GetOwnerUseCase,
    ListOwnersUseCase,
  ],
  exports: [OWNER_REPOSITORY],
})
export class OwnersModule {}
