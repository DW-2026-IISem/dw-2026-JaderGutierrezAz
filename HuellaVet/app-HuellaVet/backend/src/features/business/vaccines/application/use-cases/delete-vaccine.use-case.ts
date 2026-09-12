import { Inject, Injectable } from '@nestjs/common';
import { VaccineNotFoundException } from '../../domain/exceptions/vaccine-not-found.exception.js';
import {
  VACCINE_REPOSITORY,
  type IVaccineRepository,
} from '../../domain/interfaces/vaccine-repository.interface.js';

@Injectable()
export class DeleteVaccineUseCase {
  constructor(
    @Inject(VACCINE_REPOSITORY)
    private readonly vaccineRepository: IVaccineRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const vaccine = await this.vaccineRepository.findById(id);
    if (!vaccine) {
      throw new VaccineNotFoundException(id);
    }

    await this.vaccineRepository.delete(id);
  }
}
