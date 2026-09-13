import { Inject, Injectable } from '@nestjs/common';
import { ConsultationNotFoundException } from '../../../consultations/domain/exceptions/consultation-not-found.exception.js';
import {
  CONSULTATION_REPOSITORY,
  type IConsultationRepository,
} from '../../../consultations/domain/interfaces/consultation-repository.interface.js';
import { Recipe } from '../../domain/entities/recipe.entity.js';
import {
  RECIPE_REPOSITORY,
  type IRecipeRepository,
} from '../../domain/interfaces/recipe-repository.interface.js';
import { CreateRecipeDto } from '../dto/create-recipe.dto.js';
import { RecipeMapper } from '../mappers/recipe.mapper.js';

@Injectable()
export class CreateRecipeUseCase {
  constructor(
    @Inject(RECIPE_REPOSITORY)
    private readonly recipeRepository: IRecipeRepository,
    @Inject(CONSULTATION_REPOSITORY)
    private readonly consultationRepository: IConsultationRepository,
  ) {}

  async execute(dto: CreateRecipeDto) {
    const consultation = await this.consultationRepository.findById(dto.consultationId);
    if (!consultation) {
      throw new ConsultationNotFoundException(dto.consultationId);
    }

    const recipe = Recipe.create({
      consultationId: dto.consultationId,
      name: dto.name,
      description: dto.description,
    });

    const created = await this.recipeRepository.create(recipe);
    return RecipeMapper.toResponse(created);
  }
}
