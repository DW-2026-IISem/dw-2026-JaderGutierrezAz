import { Inject, Injectable } from '@nestjs/common';
import { VaccineBatchNotFoundException } from '../../domain/exceptions/vaccine-batch-not-found.exception.js';
import {
  VACCINE_BATCH_REPOSITORY,
  type IVaccineBatchRepository,
} from '../../domain/interfaces/vaccine-batch-repository.interface.js';
import { VaccineBatchMapper } from '../mappers/vaccine-batch.mapper.js';

@Injectable()
export class GetVaccineBatchUseCase {
  constructor(
    @Inject(VACCINE_BATCH_REPOSITORY)
    private readonly vaccineBatchRepository: IVaccineBatchRepository,
  ) {}

  async execute(id: number) {
    const vaccineBatch = await this.vaccineBatchRepository.findById(id);
    if (!vaccineBatch) {
      throw new VaccineBatchNotFoundException(id);
    }

    return VaccineBatchMapper.toResponse(vaccineBatch);
  }
}
