import { Inject, Injectable } from '@nestjs/common';
import { PetNotFoundException } from '../../domain/exceptions/pet-not-found.exception.js';
import {
  PET_REPOSITORY,
  type IPetRepository,
} from '../../domain/interfaces/pet-repository.interface.js';
import { UpdatePetDto } from '../dto/update-pet.dto.js';
import { PetMapper } from '../mappers/pet.mapper.js';

@Injectable()
export class UpdatePetUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly petRepository: IPetRepository,
  ) {}

  async execute(id: number, dto: UpdatePetDto) {
    const pet = await this.petRepository.findById(id);
    if (!pet) {
      throw new PetNotFoundException(id);
    }

    pet.update(dto);
    const updated = await this.petRepository.update(pet);
    return PetMapper.toResponse(updated);
  }
}
