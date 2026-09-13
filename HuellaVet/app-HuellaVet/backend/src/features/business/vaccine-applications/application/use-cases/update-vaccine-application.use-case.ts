import { Inject, Injectable } from '@nestjs/common';
import { VaccineApplicationNotFoundException } from '../../domain/exceptions/vaccine-application-not-found.exception.js';
import {
  VACCINE_APPLICATION_REPOSITORY,
  type IVaccineApplicationRepository,
} from '../../domain/interfaces/vaccine-application-repository.interface.js';
import { UpdateVaccineApplicationDto } from '../dto/update-vaccine-application.dto.js';
import { VaccineApplicationMapper } from '../mappers/vaccine-application.mapper.js';

@Injectable()
export class UpdateVaccineApplicationUseCase {
  constructor(
    @Inject(VACCINE_APPLICATION_REPOSITORY)
    private readonly vaccineApplicationRepository: IVaccineApplicationRepository,
  ) {}

  async execute(id: number, dto: UpdateVaccineApplicationDto) {
    const vaccineApplication = await this.vaccineApplicationRepository.findById(id);
    if (!vaccineApplication) {
      throw new VaccineApplicationNotFoundException(id);
    }

    vaccineApplication.update(dto);
    const updated = await this.vaccineApplicationRepository.update(vaccineApplication);
    return VaccineApplicationMapper.toResponse(updated);
  }
}
