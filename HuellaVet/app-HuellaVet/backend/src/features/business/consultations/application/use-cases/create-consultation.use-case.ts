import { Inject, Injectable } from '@nestjs/common';
import { AppointmentNotFoundException } from '../../../appointments/domain/exceptions/appointment-not-found.exception.js';
import {
  APPOINTMENT_REPOSITORY,
  type IAppointmentRepository,
} from '../../../appointments/domain/interfaces/appointment-repository.interface.js';
import { Consultation } from '../../domain/entities/consultation.entity.js';
import { ConsultationAlreadyExistsException } from '../../domain/exceptions/consultation-already-exists.exception.js';
import {
  CONSULTATION_REPOSITORY,
  type IConsultationRepository,
} from '../../domain/interfaces/consultation-repository.interface.js';
import { CreateConsultationDto } from '../dto/create-consultation.dto.js';
import { ConsultationMapper } from '../mappers/consultation.mapper.js';

@Injectable()
export class CreateConsultationUseCase {
  constructor(
    @Inject(CONSULTATION_REPOSITORY)
    private readonly consultationRepository: IConsultationRepository,
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(dto: CreateConsultationDto) {
    const appointment = await this.appointmentRepository.findById(dto.appointmentId);
    if (!appointment) {
      throw new AppointmentNotFoundException(dto.appointmentId);
    }

    const existing = await this.consultationRepository.findByAppointmentId(
      dto.appointmentId,
    );
    if (existing) {
      throw new ConsultationAlreadyExistsException(dto.appointmentId);
    }

    const consultation = Consultation.create({
      appointmentId: dto.appointmentId,
      name: dto.name,
      description: dto.description,
    });

    const created = await this.consultationRepository.create(consultation);
    return ConsultationMapper.toResponse(created);
  }
}
