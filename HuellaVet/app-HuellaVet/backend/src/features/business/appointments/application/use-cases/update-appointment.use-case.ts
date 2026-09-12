import { Inject, Injectable } from '@nestjs/common';
import { AppointmentNotFoundException } from '../../domain/exceptions/appointment-not-found.exception.js';
import { AppointmentOverlapException } from '../../domain/exceptions/appointment-overlap.exception.js';
import {
  APPOINTMENT_REPOSITORY,
  type IAppointmentRepository,
} from '../../domain/interfaces/appointment-repository.interface.js';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto.js';
import { AppointmentMapper } from '../mappers/appointment.mapper.js';

@Injectable()
export class UpdateAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(id: number, dto: UpdateAppointmentDto) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new AppointmentNotFoundException(id);
    }

    const nextStart = dto.startDate ? new Date(dto.startDate) : appointment.startDate;
    const nextEnd = dto.endDate ? new Date(dto.endDate) : appointment.endDate;

    if (dto.startDate || dto.endDate) {
      const overlapping = await this.appointmentRepository.findOverlapping(
        appointment.veterinarianId,
        nextStart,
        nextEnd,
        appointment.id,
      );
      if (overlapping.length > 0) {
        throw new AppointmentOverlapException(appointment.veterinarianId);
      }
    }

    appointment.update({
      startDate: dto.startDate ? nextStart : undefined,
      endDate: dto.endDate ? nextEnd : undefined,
      reason: dto.reason,
      state: dto.state,
    });

    const updated = await this.appointmentRepository.update(appointment);
    return AppointmentMapper.toResponse(updated);
  }
}
