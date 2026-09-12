import { Inject, Injectable } from '@nestjs/common';
import { VaccineBatchNotFoundException } from '../../domain/exceptions/vaccine-batch-not-found.exception.js';
import {
  VACCINE_BATCH_REPOSITORY,
  type IVaccineBatchRepository,
} from '../../domain/interfaces/vaccine-batch-repository.interface.js';
import { UpdateVaccineBatchDto } from '../dto/update-vaccine-batch.dto.js';
import { VaccineBatchMapper } from '../mappers/vaccine-batch.mapper.js';

@Injectable()
export class UpdateVaccineBatchUseCase {
  constructor(
    @Inject(VACCINE_BATCH_REPOSITORY)
    private readonly vaccineBatchRepository: IVaccineBatchRepository,
  ) {}

  async execute(id: number, dto: UpdateVaccineBatchDto) {
    const vaccineBatch = await this.vaccineBatchRepository.findById(id);
    if (!vaccineBatch) {
      throw new VaccineBatchNotFoundException(id);
    }

    vaccineBatch.update(dto);
    const updated = await this.vaccineBatchRepository.update(vaccineBatch);
    return VaccineBatchMapper.toResponse(updated);
  }
}
