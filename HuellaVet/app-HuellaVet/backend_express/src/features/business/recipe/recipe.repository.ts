import { CreationAttributes } from "sequelize";
import { Recipe } from "./recipe.model";

/**
 * Capa Repository del feature Recipe.
 * Única que habla con Sequelize. No contiene reglas de negocio.
 */
export class RecipeRepository {
  public async findAllActive(): Promise<Recipe[]> {
    return Recipe.findAll({ where: { is_active: true } });
  }

  public async findById(id: number): Promise<Recipe | null> {
    return Recipe.findByPk(id);
  }

  public async create(data: CreationAttributes<Recipe>): Promise<Recipe> {
    return Recipe.create(data);
  }

  public async update(recipe: Recipe, data: Partial<Recipe>): Promise<Recipe> {
    return recipe.update(data);
  }

  public async delete(recipe: Recipe): Promise<void> {
    await recipe.destroy();
  }
}
