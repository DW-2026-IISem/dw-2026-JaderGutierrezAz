import { Inject, Injectable } from '@nestjs/common';
import { VaccineNotFoundException } from '../../domain/exceptions/vaccine-not-found.exception.js';
import {
  VACCINE_REPOSITORY,
  type IVaccineRepository,
} from '../../domain/interfaces/vaccine-repository.interface.js';
import { VaccineMapper } from '../mappers/vaccine.mapper.js';

@Injectable()
export class GetVaccineUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY)
    private readonly vaccineRepository: IVaccineRepository,
  ) {}

  async execute(id: number) {
    const vaccine = await this.vaccineRepository.findById(id);
    if (!vaccine) {
      throw new VaccineNotFoundException(id);
    }

    return VaccineMapper.toResponse(vaccine);
  }
}
