import { Inject, Injectable } from '@nestjs/common';
import {
  PET_REPOSITORY,
  type IPetRepository,
} from '../../domain/interfaces/pet-repository.interface.js';
import { PetFilterDto } from '../dto/pet-filter.dto.js';
import { PetMapper } from '../mappers/pet.mapper.js';

@Injectable()
export class ListPetsUseCase {
  constructor(
    @Inject(PET_REPOSITORY)
    private readonly petRepository: IPetRepository,
  ) {}

  async execute(filter: PetFilterDto) {
    const result = await this.petRepository.findAll(filter);
    return {
      items: result.items.map((pet) => PetMapper.toResponse(pet)),
      meta: result.meta,
    };
  }
}
