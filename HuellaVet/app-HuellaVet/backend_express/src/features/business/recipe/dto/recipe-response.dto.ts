import { Recipe, RecipeI } from "../recipe.model";

/** Respuesta HTTP de una receta. */
export type RecipeResponseDto = RecipeI;

/** Mapper modelo -> DTO de respuesta. */
export function toRecipeResponse(recipe: Recipe): RecipeResponseDto {
  return recipe.toJSON() as RecipeI;
}
