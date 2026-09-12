import { VaccineBatch } from '../../domain/entities/vaccine-batch.entity.js';
import { VaccineBatchResponseDto } from '../dto/vaccine-batch-response.dto.js';
import { VaccineBatchModel } from '../../infrastructure/persistence/models/vaccine-batch.model.js';

export class VaccineBatchMapper {
  static toDomain(model: VaccineBatchModel): VaccineBatch {
    return VaccineBatch.reconstitute({
      id: model.id,
      vaccineId: model.vaccineId,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: VaccineBatch): VaccineBatchResponseDto {
    return {
      id: entity.id!,
      vaccineId: entity.vaccineId,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: VaccineBatch): Partial<VaccineBatchModel> {
    return {
      id: entity.id,
      vaccineId: entity.vaccineId,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
    };
  }
}
