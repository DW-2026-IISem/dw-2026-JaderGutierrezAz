import { Inject, Injectable } from '@nestjs/common';
import { RecipeNotFoundException } from '../../domain/exceptions/recipe-not-found.exception.js';
import {
  RECIPE_REPOSITORY,
  type IRecipeRepository,
} from '../../domain/interfaces/recipe-repository.interface.js';

@Injectable()
export class DeleteRecipeUseCase {
  constructor(
    @Inject(RECIPE_REPOSITORY)
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new RecipeNotFoundException(id);
    }

    await this.recipeRepository.delete(id);
  }
}
