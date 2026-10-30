import { Injectable } from '@angular/core';
import { Recipe, RecipeCreate, RecipeUpdate } from '../../core/models/recipe.model';
import { CrudApi } from '../../core/services/crud-api';

/** /api/recetas — la lista llega en `recipes`. */
@Injectable({ providedIn: 'root' })
export class RecipeApi extends CrudApi<Recipe, RecipeCreate, RecipeUpdate> {
  constructor() {
    super('recetas', 'recipes', 'recipe');
  }
}
