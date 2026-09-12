import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Veterinarian } from '../../../domain/entities/veterinarian.entity.js';
import {
  VeterinarianFindAllParams,
  IVeterinarianRepository,
} from '../../../domain/interfaces/veterinarian-repository.interface.js';
import { VeterinarianMapper } from '../../../application/mappers/veterinarian.mapper.js';
import { VeterinarianModel } from '../models/veterinarian.model.js';

@Injectable()
export class VeterinarianRepository implements IVeterinarianRepository {
  async create(veterinarian: Veterinarian): Promise<Veterinarian> {
    const model = await VeterinarianModel.create(
      VeterinarianMapper.toPersistence(veterinarian),
    );
    return VeterinarianMapper.toDomain(model);
  }

  async update(veterinarian: Veterinarian): Promise<Veterinarian> {
    await VeterinarianModel.update(
      VeterinarianMapper.toPersistence(veterinarian),
      { where: { id: veterinarian.id } },
    );
    const updated = await VeterinarianModel.findByPk(veterinarian.id!);
    return VeterinarianMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await VeterinarianModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Veterinarian | null> {
    const model = await VeterinarianModel.findByPk(id);
    return model ? VeterinarianMapper.toDomain(model) : null;
  }

  async findAll(params: VeterinarianFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where = params.search
      ? { name: { [Op.like]: `%${params.search}%` } }
      : {};

    const { rows, count } = await VeterinarianModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => VeterinarianMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
