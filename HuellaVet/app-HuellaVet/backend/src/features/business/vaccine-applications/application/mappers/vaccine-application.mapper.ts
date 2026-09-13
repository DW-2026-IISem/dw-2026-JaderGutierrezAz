import { VaccineApplication } from '../../domain/entities/vaccine-application.entity.js';
import { VaccineApplicationResponseDto } from '../dto/vaccine-application-response.dto.js';
import { VaccineApplicationModel } from '../../infrastructure/persistence/models/vaccine-application.model.js';

export class VaccineApplicationMapper {
  static toDomain(model: VaccineApplicationModel): VaccineApplication {
    return VaccineApplication.reconstitute({
      id: model.id,
      consultationId: model.consultationId,
      vaccineBatchId: model.vaccineBatchId,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: VaccineApplication): VaccineApplicationResponseDto {
    return {
      id: entity.id!,
      consultationId: entity.consultationId,
      vaccineBatchId: entity.vaccineBatchId,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: VaccineApplication): Partial<VaccineApplicationModel> {
    return {
      id: entity.id,
      consultationId: entity.consultationId,
      vaccineBatchId: entity.vaccineBatchId,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
    };
  }
}
