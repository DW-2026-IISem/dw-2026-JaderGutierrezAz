import { Inject, Injectable } from '@nestjs/common';
import {
  RECIPE_REPOSITORY,
  type IRecipeRepository,
} from '../../domain/interfaces/recipe-repository.interface.js';
import { RecipeFilterDto } from '../dto/recipe-filter.dto.js';
import { RecipeMapper } from '../mappers/recipe.mapper.js';

@Injectable()
export class ListRecipesUseCase {
  constructor(
    @Inject(RECIPE_REPOSITORY)
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async execute(filter: RecipeFilterDto) {
    const result = await this.recipeRepository.findAll(filter);
    return {
      items: result.items.map((r) => RecipeMapper.toResponse(r)),
      meta: result.meta,
    };
  }
}
