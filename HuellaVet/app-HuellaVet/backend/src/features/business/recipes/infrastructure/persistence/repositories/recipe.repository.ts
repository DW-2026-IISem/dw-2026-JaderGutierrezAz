import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Recipe } from '../../../domain/entities/recipe.entity.js';
import {
  RecipeFindAllParams,
  IRecipeRepository,
} from '../../../domain/interfaces/recipe-repository.interface.js';
import { RecipeMapper } from '../../../application/mappers/recipe.mapper.js';
import { RecipeModel } from '../models/recipe.model.js';

@Injectable()
export class RecipeRepository implements IRecipeRepository {
  async create(recipe: Recipe): Promise<Recipe> {
    const model = await RecipeModel.create(RecipeMapper.toPersistence(recipe));
    return RecipeMapper.toDomain(model);
  }

  async update(recipe: Recipe): Promise<Recipe> {
    await RecipeModel.update(RecipeMapper.toPersistence(recipe), {
      where: { id: recipe.id },
    });
    const updated = await RecipeModel.findByPk(recipe.id!);
    return RecipeMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await RecipeModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Recipe | null> {
    const model = await RecipeModel.findByPk(id);
    return model ? RecipeMapper.toDomain(model) : null;
  }

  async findAll(params: RecipeFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};
    if (params.consultationId) {
      where.consultationId = params.consultationId;
    }
    if (params.search) {
      where.name = { [Op.like]: `%${params.search}%` };
    }

    const { rows, count } = await RecipeModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => RecipeMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
