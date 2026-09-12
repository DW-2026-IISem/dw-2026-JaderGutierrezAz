import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { VaccineBatch } from '../../../domain/entities/vaccine-batch.entity.js';
import {
  VaccineBatchFindAllParams,
  IVaccineBatchRepository,
} from '../../../domain/interfaces/vaccine-batch-repository.interface.js';
import { VaccineBatchMapper } from '../../../application/mappers/vaccine-batch.mapper.js';
import { VaccineBatchModel } from '../models/vaccine-batch.model.js';

@Injectable()
export class VaccineBatchRepository implements IVaccineBatchRepository {
  async create(vaccineBatch: VaccineBatch): Promise<VaccineBatch> {
    const model = await VaccineBatchModel.create(
      VaccineBatchMapper.toPersistence(vaccineBatch),
    );
    return VaccineBatchMapper.toDomain(model);
  }

  async update(vaccineBatch: VaccineBatch): Promise<VaccineBatch> {
    await VaccineBatchModel.update(
      VaccineBatchMapper.toPersistence(vaccineBatch),
      { where: { id: vaccineBatch.id } },
    );
    const updated = await VaccineBatchModel.findByPk(vaccineBatch.id!);
    return VaccineBatchMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await VaccineBatchModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<VaccineBatch | null> {
    const model = await VaccineBatchModel.findByPk(id);
    return model ? VaccineBatchMapper.toDomain(model) : null;
  }

  async findAll(params: VaccineBatchFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};
    if (params.vaccineId) {
      where.vaccineId = params.vaccineId;
    }
    if (params.search) {
      where.name = { [Op.like]: `%${params.search}%` };
    }

    const { rows, count } = await VaccineBatchModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => VaccineBatchMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
