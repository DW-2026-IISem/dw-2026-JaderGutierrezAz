import { Pet } from '../../domain/entities/pet.entity.js';
import { PetResponseDto } from '../dto/pet-response.dto.js';
import { PetModel } from '../../infrastructure/persistence/models/pet.model.js';

export class PetMapper {
  static toDomain(model: PetModel): Pet {
    return Pet.reconstitute({
      id: model.id,
      ownerId: model.ownerId,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Pet): PetResponseDto {
    return {
      id: entity.id!,
      ownerId: entity.ownerId,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Pet): Partial<PetModel> {
    return {
      id: entity.id,
      ownerId: entity.ownerId,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
    };
  }
}
