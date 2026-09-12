import { Inject, Injectable } from '@nestjs/common';
import { VaccineNotFoundException } from '../../domain/exceptions/vaccine-not-found.exception.js';
import {
  VACCINE_REPOSITORY,
  type IVaccineRepository,
} from '../../domain/interfaces/vaccine-repository.interface.js';
import { UpdateVaccineDto } from '../dto/update-vaccine.dto.js';
import { VaccineMapper } from '../mappers/vaccine.mapper.js';

@Injectable()
export class UpdateVaccineUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY)
    private readonly vaccineRepository: IVaccineRepository,
  ) {}

  async execute(id: number, dto: UpdateVaccineDto) {
    const vaccine = await this.vaccineRepository.findById(id);
    if (!vaccine) {
      throw new VaccineNotFoundException(id);
    }

    vaccine.update(dto);
    const updated = await this.vaccineRepository.update(vaccine);
    return VaccineMapper.toResponse(updated);
  }
}
