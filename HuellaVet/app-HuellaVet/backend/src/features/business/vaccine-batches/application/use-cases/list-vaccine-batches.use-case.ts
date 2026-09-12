import { Inject, Injectable } from '@nestjs/common';
import {
  VACCINE_BATCH_REPOSITORY,
  type IVaccineBatchRepository,
} from '../../domain/interfaces/vaccine-batch-repository.interface.js';
import { VaccineBatchFilterDto } from '../dto/vaccine-batch-filter.dto.js';
import { VaccineBatchMapper } from '../mappers/vaccine-batch.mapper.js';

@Injectable()
export class ListVaccineBatchesUseCase {
  constructor(
    @Inject(VACCINE_BATCH_REPOSITORY)
    private readonly vaccineBatchRepository: IVaccineBatchRepository,
  ) {}

  async execute(filter: VaccineBatchFilterDto) {
    const result = await this.vaccineBatchRepository.findAll(filter);
    return {
      items: result.items.map((vb) => VaccineBatchMapper.toResponse(vb)),
      meta: result.meta,
    };
  }
}
