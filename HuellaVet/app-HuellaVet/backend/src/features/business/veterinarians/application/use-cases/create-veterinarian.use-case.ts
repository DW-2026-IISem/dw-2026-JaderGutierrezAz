import { Inject, Injectable } from '@nestjs/common';
import { Veterinarian } from '../../domain/entities/veterinarian.entity.js';
import {
  VETERINARIAN_REPOSITORY,
  type IVeterinarianRepository,
} from '../../domain/interfaces/veterinarian-repository.interface.js';
import { CreateVeterinarianDto } from '../dto/create-veterinarian.dto.js';
import { VeterinarianMapper } from '../mappers/veterinarian.mapper.js';

@Injectable()
export class CreateVeterinarianUseCase {
  constructor(
    @Inject(VETERINARIAN_REPOSITORY)
    private readonly veterinarianRepository: IVeterinarianRepository,
  ) {}

  async execute(dto: CreateVeterinarianDto) {
    const veterinarian = Veterinarian.create({
      name: dto.name,
      description: dto.description,
    });

    const created = await this.veterinarianRepository.create(veterinarian);
    return VeterinarianMapper.toResponse(created);
  }
}
