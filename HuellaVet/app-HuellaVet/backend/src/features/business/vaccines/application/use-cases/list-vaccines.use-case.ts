import { Inject, Injectable } from '@nestjs/common';
import {
  VACCINE_REPOSITORY,
  type IVaccineRepository,
} from '../../domain/interfaces/vaccine-repository.interface.js';
import { VaccineFilterDto } from '../dto/vaccine-filter.dto.js';
import { VaccineMapper } from '../mappers/vaccine.mapper.js';

@Injectable()
export class ListVaccinesUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY)
    private readonly vaccineRepository: IVaccineRepository,
  ) {}

  async execute(filter: VaccineFilterDto) {
    const result = await this.vaccineRepository.findAll(filter);
    return {
      items: result.items.map((v) => VaccineMapper.toResponse(v)),
      meta: result.meta,
    };
  }
}
