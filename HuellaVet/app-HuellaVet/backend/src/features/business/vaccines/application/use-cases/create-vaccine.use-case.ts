import { Inject, Injectable } from '@nestjs/common';
import { Vaccine } from '../../domain/entities/vaccine.entity.js';
import {
  VACCINE_REPOSITORY,
  type IVaccineRepository,
} from '../../domain/interfaces/vaccine-repository.interface.js';
import { CreateVaccineDto } from '../dto/create-vaccine.dto.js';
import { VaccineMapper } from '../mappers/vaccine.mapper.js';

@Injectable()
export class CreateVaccineUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY)
    private readonly vaccineRepository: IVaccineRepository,
  ) {}

  async execute(dto: CreateVaccineDto) {
    const vaccine = Vaccine.create({
      name: dto.name,
      description: dto.description,
    });

    const created = await this.vaccineRepository.create(vaccine);
    return VaccineMapper.toResponse(created);
  }
}
