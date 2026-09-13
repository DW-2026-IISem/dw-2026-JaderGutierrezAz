import { Inject, Injectable } from '@nestjs/common';
import {
  VACCINE_APPLICATION_REPOSITORY,
  type IVaccineApplicationRepository,
} from '../../domain/interfaces/vaccine-application-repository.interface.js';
import { VaccineApplicationFilterDto } from '../dto/vaccine-application-filter.dto.js';
import { VaccineApplicationMapper } from '../mappers/vaccine-application.mapper.js';

@Injectable()
export class ListVaccineApplicationsUseCase {
  constructor(
    @Inject(VACCINE_APPLICATION_REPOSITORY)
    private readonly vaccineApplicationRepository: IVaccineApplicationRepository,
  ) {}

  async execute(filter: VaccineApplicationFilterDto) {
    const result = await this.vaccineApplicationRepository.findAll(filter);
    return {
      items: result.items.map((va) => VaccineApplicationMapper.toResponse(va)),
      meta: result.meta,
    };
  }
}
