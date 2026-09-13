import { Inject, Injectable } from '@nestjs/common';
import { RecipeNotFoundException } from '../../domain/exceptions/recipe-not-found.exception.js';
import {
  RECIPE_REPOSITORY,
  type IRecipeRepository,
} from '../../domain/interfaces/recipe-repository.interface.js';
import { RecipeMapper } from '../mappers/recipe.mapper.js';

@Injectable()
export class GetRecipeUseCase {
  constructor(
    @Inject(RECIPE_REPOSITORY)
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(id: number) {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new RecipeNotFoundException(id);
    }

    return RecipeMapper.toResponse(recipe);
  }
}
