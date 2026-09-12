import { Inject, Injectable } from '@nestjs/common';
import {
  VETERINARIAN_REPOSITORY,
  type IVeterinarianRepository,
} from '../../domain/interfaces/veterinarian-repository.interface.js';
import { VeterinarianFilterDto } from '../dto/veterinarian-filter.dto.js';
import { VeterinarianMapper } from '../mappers/veterinarian.mapper.js';

@Injectable()
export class ListVeterinariansUseCase {
  constructor(
    @Inject(VETERINARIAN_REPOSITORY)
    private readonly veterinarianRepository: IVeterinarianRepository,
  ) {}

  async execute(filter: VeterinarianFilterDto) {
    const result = await this.veterinarianRepository.findAll(filter);
    return {
      items: result.items.map((v) => VeterinarianMapper.toResponse(v)),
      meta: result.meta,
    };
  }
}
