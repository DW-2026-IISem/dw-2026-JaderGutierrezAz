import { Appointment } from '../../../domain/entities/appointment.entity.js';
import { AppointmentResponseDto } from '../../../application/dto/appointment-response.dto.js';
import { AppointmentMapper } from '../../../application/mappers/appointment.mapper.js';

export class AppointmentSerializer {
  static serialize(entity: Appointment): AppointmentResponseDto {
    return AppointmentMapper.toResponse(entity);
  }
}
