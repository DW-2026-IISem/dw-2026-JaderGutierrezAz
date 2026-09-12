import { Inject, Injectable } from '@nestjs/common';
import {
  APPOINTMENT_REPOSITORY,
  type IAppointmentRepository,
} from '../../domain/interfaces/appointment-repository.interface.js';
import { AppointmentFilterDto } from '../dto/appointment-filter.dto.js';
import { AppointmentMapper } from '../mappers/appointment.mapper.js';

@Injectable()
export class ListAppointmentsUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(filter: AppointmentFilterDto) {
    const result = await this.appointmentRepository.findAll(filter);
    return {
      items: result.items.map((a) => AppointmentMapper.toResponse(a)),
      meta: result.meta,
    };
  }
}
