import { Inject, Injectable } from '@nestjs/common';
import { ConsultationNotFoundException } from '../../../consultations/domain/exceptions/consultation-not-found.exception.js';
import {
  CONSULTATION_REPOSITORY,
  type IConsultationRepository,
} from '../../../consultations/domain/interfaces/consultation-repository.interface.js';
import { VaccineBatchNotFoundException } from '../../../vaccine-batches/domain/exceptions/vaccine-batch-not-found.exception.js';
import {
  VACCINE_BATCH_REPOSITORY,
  type IVaccineBatchRepository,
} from '../../../vaccine-batches/domain/interfaces/vaccine-batch-repository.interface.js';
import { VaccineApplication } from '../../domain/entities/vaccine-application.entity.js';
import {
  VACCINE_APPLICATION_REPOSITORY,
  type IVaccineApplicationRepository,
} from '../../domain/interfaces/vaccine-application-repository.interface.js';
import { CreateVaccineApplicationDto } from '../dto/create-vaccine-application.dto.js';
import { VaccineApplicationMapper } from '../mappers/vaccine-application.mapper.js';

@Injectable()
export class CreateVaccineApplicationUseCase {
  constructor(
    @Inject(VACCINE_APPLICATION_REPOSITORY)
    private readonly vaccineApplicationRepository: IVaccineApplicationRepository,
    @Inject(CONSULTATION_REPOSITORY)
    private readonly consultationRepository: IConsultationRepository,
    @Inject(VACCINE_BATCH_REPOSITORY)
    private readonly vaccineBatchRepository: IVaccineBatchRepository,
  ) {}

  async execute(dto: CreateVaccineApplicationDto) {
    const consultation = await this.consultationRepository.findById(dto.consultationId);
    if (!consultation) {
      throw new ConsultationNotFoundException(dto.consultationId);
    }

    const vaccineBatch = await this.vaccineBatchRepository.findById(dto.vaccineBatchId);
    if (!vaccineBatch) {
      throw new VaccineBatchNotFoundException(dto.vaccineBatchId);
    }

    const vaccineApplication = VaccineApplication.create({
      consultationId: dto.consultationId,
      vaccineBatchId: dto.vaccineBatchId,
      name: dto.name,
      description: dto.description,
    });

    const created = await this.vaccineApplicationRepository.create(vaccineApplication);
    return VaccineApplicationMapper.toResponse(created);
  }
}
