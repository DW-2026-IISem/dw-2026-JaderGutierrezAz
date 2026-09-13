import { Inject, Injectable } from '@nestjs/common';
import { VaccineApplicationNotFoundException } from '../../domain/exceptions/vaccine-application-not-found.exception.js';
import {
  VACCINE_APPLICATION_REPOSITORY,
  type IVaccineApplicationRepository,
} from '../../domain/interfaces/vaccine-application-repository.interface.js';

@Injectable()
export class DeleteVaccineApplicationUseCase {
  constructor(
    @Inject(VACCINE_APPLICATION_REPOSITORY)
    private readonly vaccineApplicationRepository: IVaccineApplicationRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const vaccineApplication = await this.vaccineApplicationRepository.findById(id);
    if (!vaccineApplication) {
      throw new VaccineApplicationNotFoundException(id);
    }

    await this.vaccineApplicationRepository.delete(id);
  }
}
