import { Module } from '@nestjs/common';
import { ConsultationsModule } from '../consultations/consultations.module.js';
import { RECIPE_REPOSITORY } from './domain/interfaces/recipe-repository.interface.js';
import { RecipeRepository } from './infrastructure/persistence/repositories/recipe.repository.js';
import { CreateRecipeUseCase } from './application/use-cases/create-recipe.use-case.js';
import { UpdateRecipeUseCase } from './application/use-cases/update-recipe.use-case.js';
import { DeleteRecipeUseCase } from './application/use-cases/delete-recipe.use-case.js';
import { GetRecipeUseCase } from './application/use-cases/get-recipe.use-case.js';
import { ListRecipesUseCase } from './application/use-cases/list-recipes.use-case.js';
import { RecipesController } from './presentation/http/controllers/recipes.controller.js';

@Module({
  imports: [ConsultationsModule],
  controllers: [RecipesController],
  providers: [
    RecipeRepository,
    { provide: RECIPE_REPOSITORY, useExisting: RecipeRepository },
    CreateRecipeUseCase,
    UpdateRecipeUseCase,
    DeleteRecipeUseCase,
    GetRecipeUseCase,
    ListRecipesUseCase,
  ],
  exports: [RECIPE_REPOSITORY],
})
export class RecipesModule {}
