import { Vaccine } from '../../domain/entities/vaccine.entity.js';
import { VaccineResponseDto } from '../dto/vaccine-response.dto.js';
import { VaccineModel } from '../../infrastructure/persistence/models/vaccine.model.js';

export class VaccineMapper {
  static toDomain(model: VaccineModel): Vaccine {
    return Vaccine.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Vaccine): VaccineResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Vaccine): Partial<VaccineModel> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
    };
  }
}
