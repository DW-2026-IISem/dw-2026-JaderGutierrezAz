import { Inject, Injectable } from '@nestjs/common';
import { AppointmentNotFoundException } from '../../domain/exceptions/appointment-not-found.exception.js';
import {
  APPOINTMENT_REPOSITORY,
  type IAppointmentRepository,
} from '../../domain/interfaces/appointment-repository.interface.js';
import { AppointmentMapper } from '../mappers/appointment.mapper.js';

@Injectable()
export class GetAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(id: number) {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new AppointmentNotFoundException(id);
    }

    return AppointmentMapper.toResponse(appointment);
  }
}
