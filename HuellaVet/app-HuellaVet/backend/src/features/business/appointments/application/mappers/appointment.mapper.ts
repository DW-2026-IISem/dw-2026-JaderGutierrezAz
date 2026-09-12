import { Appointment } from '../../domain/entities/appointment.entity.js';
import { AppointmentResponseDto } from '../dto/appointment-response.dto.js';
import { AppointmentModel } from '../../infrastructure/persistence/models/appointment.model.js';

export class AppointmentMapper {
  static toDomain(model: AppointmentModel): Appointment {
    return Appointment.reconstitute({
      id: model.id,
      petId: model.petId,
      veterinarianId: model.veterinarianId,
      startDate: model.startDate,
      endDate: model.endDate,
      reason: model.reason ?? undefined,
      state: model.state,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Appointment): AppointmentResponseDto {
    return {
      id: entity.id!,
      petId: entity.petId,
      veterinarianId: entity.veterinarianId,
      startDate: entity.startDate,
      endDate: entity.endDate,
      reason: entity.reason,
      state: entity.state,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Appointment): Partial<AppointmentModel> {
    return {
      id: entity.id,
      petId: entity.petId,
      veterinarianId: entity.veterinarianId,
      startDate: entity.startDate,
      endDate: entity.endDate,
      reason: entity.reason ?? null,
      state: entity.state,
    };
  }
}
