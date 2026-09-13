import { Inject, Injectable } from '@nestjs/common';
import { RecipeNotFoundException } from '../../domain/exceptions/recipe-not-found.exception.js';
import {
  RECIPE_REPOSITORY,
  type IRecipeRepository,
} from '../../domain/interfaces/recipe-repository.interface.js';
import { UpdateRecipeDto } from '../dto/update-recipe.dto.js';
import { RecipeMapper } from '../mappers/recipe.mapper.js';

@Injectable()
export class UpdateRecipeUseCase {
  constructor(
    @Inject(RECIPE_REPOSITORY)
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(id: number, dto: UpdateRecipeDto) {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new RecipeNotFoundException(id);
    }

    recipe.update(dto);
    const updated = await this.recipeRepository.update(recipe);
    return RecipeMapper.toResponse(updated);
  }
}
