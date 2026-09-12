import { Consultation } from '../../domain/entities/consultation.entity.js';
import { ConsultationResponseDto } from '../dto/consultation-response.dto.js';
import { ConsultationModel } from '../../infrastructure/persistence/models/consultation.model.js';

export class ConsultationMapper {
  static toDomain(model: ConsultationModel): Consultation {
    return Consultation.reconstitute({
      id: model.id,
      appointmentId: model.appointmentId,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Consultation): ConsultationResponseDto {
    return {
      id: entity.id!,
      appointmentId: entity.appointmentId,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Consultation): Partial<ConsultationModel> {
    return {
      id: entity.id,
      appointmentId: entity.appointmentId,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
    };
  }
}
