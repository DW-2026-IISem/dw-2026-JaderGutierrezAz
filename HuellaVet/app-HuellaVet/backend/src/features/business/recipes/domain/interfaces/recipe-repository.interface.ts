import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { Recipe } from '../entities/recipe.entity.js';

export const RECIPE_REPOSITORY = 'RECIPE_REPOSITORY';

export interface RecipeFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  consultationId?: number;
}

export interface IRecipeRepository {
  create(recipe: Recipe): Promise<Recipe>;
  update(recipe: Recipe): Promise<Recipe>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Recipe | null>;
  findAll(params: RecipeFindAllParams): Promise<PaginatedResult<Recipe>>;
}
