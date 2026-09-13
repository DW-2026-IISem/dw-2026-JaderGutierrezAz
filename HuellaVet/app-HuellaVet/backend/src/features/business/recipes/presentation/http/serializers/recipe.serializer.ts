import { Recipe } from '../../../domain/entities/recipe.entity.js';
import { RecipeResponseDto } from '../../../application/dto/recipe-response.dto.js';
import { RecipeMapper } from '../../../application/mappers/recipe.mapper.js';

export class RecipeSerializer {
  static serialize(entity: Recipe): RecipeResponseDto {
    return RecipeMapper.toResponse(entity);
  }
}
