import {
  CreateRecipeDto,
  UpdateRecipeDto,
  PatchRecipeDto,
  RecipeResponseDto,
  toRecipeResponse,
} from "./dto";
import { RecipeRepository } from "./recipe.repository";
import { Recipe } from "./recipe.model";
import { Consultation } from "../consultation/consultation.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Recipe.
 * Reglas de negocio: consultation_id debe existir y estar activa; política de
 * borrado lógico. No conoce `req`/`res` ni escribe Sequelize directamente.
 */
export class RecipeService {
  public constructor(
    private readonly repository: RecipeRepository = new RecipeRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<RecipeResponseDto[]> {
    const recipes = await this.repository.findAllActive();
    return recipes.map((recipe) => toRecipeResponse(recipe));
  }

  public async getOne(id: number): Promise<RecipeResponseDto> {
    return toRecipeResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateRecipeDto): Promise<RecipeResponseDto> {
    await this.assertActiveConsultation(body.consultation_id);

    const recipe = await this.repository.create({
      consultation_id: body.consultation_id,
      name: body.name,
      description: body.description ?? null,
      is_active: body.is_active ?? true,
    });
    return toRecipeResponse(recipe);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateRecipeDto): Promise<RecipeResponseDto> {
    const recipe = await this.findOrFail(id);
    await this.assertActiveConsultation(body.consultation_id);

    await this.repository.update(recipe, {
      consultation_id: body.consultation_id,
      name: body.name,
      description: body.description ?? null,
    });
    return toRecipeResponse(recipe);
  }

  public async updatePatch(id: number, body: PatchRecipeDto): Promise<RecipeResponseDto> {
    const recipe = await this.findOrFail(id);

    if (body.consultation_id !== undefined) {
      await this.assertActiveConsultation(body.consultation_id);
    }

    await this.repository.update(recipe, body);
    return toRecipeResponse(recipe);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const recipe = await this.findOrFail(id, false);
    await this.repository.delete(recipe);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<RecipeResponseDto> {
    const recipe = await this.findOrFail(id);
    await this.repository.update(recipe, { is_active: false });
    return toRecipeResponse(recipe);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<Recipe> {
    const recipe = await this.repository.findById(id);
    if (!recipe || (onlyActive && !recipe.is_active)) {
      throw new AppError(404, "Recipe not found");
    }
    return recipe;
  }

  private async assertActiveConsultation(consultation_id: number): Promise<void> {
    const consultation = await Consultation.findByPk(consultation_id);
    if (!consultation) {
      throw new AppError(404, "Consultation not found");
    }
    if (!consultation.is_active) {
      throw new AppError(400, "Consultation must be active");
    }
  }
}
