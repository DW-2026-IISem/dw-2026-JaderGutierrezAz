import { Recipe } from '../../domain/entities/recipe.entity.js';
import { RecipeResponseDto } from '../dto/recipe-response.dto.js';
import { RecipeModel } from '../../infrastructure/persistence/models/recipe.model.js';

export class RecipeMapper {
  static toDomain(model: RecipeModel): Recipe {
    return Recipe.reconstitute({
      id: model.id,
      consultationId: model.consultationId,
      name: model.name,
      description: model.description ?? undefined,
      isActive: model.isActive,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toResponse(entity: Recipe): RecipeResponseDto {
    return {
      id: entity.id!,
      consultationId: entity.consultationId,
      name: entity.name,
      description: entity.description,
      isActive: entity.isActive,
      createdAt: entity.createdAt!,
      updatedAt: entity.updatedAt!,
    };
  }

  static toPersistence(entity: Recipe): Partial<RecipeModel> {
    return {
      id: entity.id,
      consultationId: entity.consultationId,
      name: entity.name,
      description: entity.description ?? null,
      isActive: entity.isActive ?? true,
    };
  }
}
