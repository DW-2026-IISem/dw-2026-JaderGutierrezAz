import { UpdateRecipeDto } from "./update-recipe.dto";

/** Datos de entrada de `PATCH /api/recetas/:id` (actualización parcial). */
export type PatchRecipeDto = Partial<UpdateRecipeDto>;
