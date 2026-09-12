import { Inject, Injectable } from '@nestjs/common';
import { VeterinarianNotFoundException } from '../../domain/exceptions/veterinarian-not-found.exception.js';
import {
  VETERINARIAN_REPOSITORY,
  type IVeterinarianRepository,
} from '../../domain/interfaces/veterinarian-repository.interface.js';
import { VeterinarianMapper } from '../mappers/veterinarian.mapper.js';

@Injectable()
export class GetVeterinarianUseCase {
  constructor(
    @Inject(VETERINARIAN_REPOSITORY)
    private readonly veterinarianRepository: IVeterinarianRepository,
  ) {}

  async execute(id: number) {
    const veterinarian = await this.veterinarianRepository.findById(id);
    if (!veterinarian) {
      throw new VeterinarianNotFoundException(id);
    }

    return VeterinarianMapper.toResponse(veterinarian);
  }
}
