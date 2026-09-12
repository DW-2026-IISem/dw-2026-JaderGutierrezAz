import { Inject, Injectable } from '@nestjs/common';
import { VaccineNotFoundException } from '../../../vaccines/domain/exceptions/vaccine-not-found.exception.js';
import {
  VACCINE_REPOSITORY,
  type IVaccineRepository,
} from '../../../vaccines/domain/interfaces/vaccine-repository.interface.js';
import { VaccineBatch } from '../../domain/entities/vaccine-batch.entity.js';
import {
  VACCINE_BATCH_REPOSITORY,
  type IVaccineBatchRepository,
} from '../../domain/interfaces/vaccine-batch-repository.interface.js';
import { CreateVaccineBatchDto } from '../dto/create-vaccine-batch.dto.js';
import { VaccineBatchMapper } from '../mappers/vaccine-batch.mapper.js';

@Injectable()
export class CreateVaccineBatchUseCase {
  constructor(
    @Inject(VACCINE_BATCH_REPOSITORY)
    private readonly vaccineBatchRepository: IVaccineBatchRepository,
    @Inject(VACCINE_REPOSITORY)
    private readonly vaccineRepository: IVaccineRepository,
  ) {}

  async execute(dto: CreateVaccineBatchDto) {
    const vaccine = await this.vaccineRepository.findById(dto.vaccineId);
    if (!vaccine) {
      throw new VaccineNotFoundException(dto.vaccineId);
    }

    const vaccineBatch = VaccineBatch.create({
      vaccineId: dto.vaccineId,
      name: dto.name,
      description: dto.description,
    });

    const created = await this.vaccineBatchRepository.create(vaccineBatch);
    return VaccineBatchMapper.toResponse(created);
  }
}
