import { Veterinarian } from '../../domain/entities/veterinarian.entity.js';
import { VeterinarianResponseDto } from '../dto/veterinarian-response.dto.js';
import { VeterinarianModel } from '../../infrastructure/persistence/models/veterinarian.model.js';

export class VeterinarianMapper {
  static toDomain(model: VeterinarianModel): Veterinarian {
    return Veterinarian.reconstitute({
      id: model.id,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Veterinarian): VeterinarianResponseDto {
    return {
      id: entity.id!,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Veterinarian): Partial<VeterinarianModel> {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
    };
  }
}
