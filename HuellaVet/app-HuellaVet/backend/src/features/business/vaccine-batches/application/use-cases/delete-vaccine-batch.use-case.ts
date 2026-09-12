import { Inject, Injectable } from '@nestjs/common';
import { VaccineBatchNotFoundException } from '../../domain/exceptions/vaccine-batch-not-found.exception.js';
import {
  VACCINE_BATCH_REPOSITORY,
  type IVaccineBatchRepository,
} from '../../domain/interfaces/vaccine-batch-repository.interface.js';

@Injectable()
export class DeleteVaccineBatchUseCase {
  constructor(
    @Inject(VACCINE_BATCH_REPOSITORY)
    private readonly vaccineBatchRepository: IVaccineBatchRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const vaccineBatch = await this.vaccineBatchRepository.findById(id);
    if (!vaccineBatch) {
      throw new VaccineBatchNotFoundException(id);
    }

    await this.vaccineBatchRepository.delete(id);
  }
}
