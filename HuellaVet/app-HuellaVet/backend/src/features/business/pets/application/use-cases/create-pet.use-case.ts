import { Inject, Injectable } from '@nestjs/common';
import { OwnerNotFoundException } from '../../../owners/domain/exceptions/owner-not-found.exception.js';
import {
  OWNER_REPOSITORY,
  type IOwnerRepository,
} from '../../../owners/domain/interfaces/owner-repository.interface.js';
import { Pet } from '../../domain/entities/pet.entity.js';
import {
  PET_REPOSITORY,
  type IPetRepository,
} from '../../domain/interfaces/pet-repository.interface.js';
import { CreatePetDto } from '../dto/create-pet.dto.js';
import { PetMapper } from '../mappers/pet.mapper.js';

@Injectable()
export class CreatePetUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly petRepository: IPetRepository,
    @Inject(OWNER_REPOSITORY)
    private readonly ownerRepository: IOwnerRepository,
  ) {}

  async execute(dto: CreatePetDto) {
    const owner = await this.ownerRepository.findById(dto.ownerId);
    if (!owner) {
      throw new OwnerNotFoundException(dto.ownerId);
    }

    const pet = Pet.create({
      ownerId: dto.ownerId,
      name: dto.name,
      description: dto.description,
    });

    const created = await this.petRepository.create(pet);
    return PetMapper.toResponse(created);
  }
}
