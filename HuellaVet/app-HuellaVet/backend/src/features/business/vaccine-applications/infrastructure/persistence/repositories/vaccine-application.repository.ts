import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { VaccineApplication } from '../../../domain/entities/vaccine-application.entity.js';
import {
  VaccineApplicationFindAllParams,
  IVaccineApplicationRepository,
} from '../../../domain/interfaces/vaccine-application-repository.interface.js';
import { VaccineApplicationMapper } from '../../../application/mappers/vaccine-application.mapper.js';
import { VaccineApplicationModel } from '../models/vaccine-application.model.js';

@Injectable()
export class VaccineApplicationRepository implements IVaccineApplicationRepository {
  async create(vaccineApplication: VaccineApplication): Promise<VaccineApplication> {
    const model = await VaccineApplicationModel.create(
      VaccineApplicationMapper.toPersistence(vaccineApplication),
    );
    return VaccineApplicationMapper.toDomain(model);
  }

  async update(vaccineApplication: VaccineApplication): Promise<VaccineApplication> {
    await VaccineApplicationModel.update(
      VaccineApplicationMapper.toPersistence(vaccineApplication),
      { where: { id: vaccineApplication.id } },
    );
    const updated = await VaccineApplicationModel.findByPk(vaccineApplication.id!);
    return VaccineApplicationMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await VaccineApplicationModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<VaccineApplication | null> {
    const model = await VaccineApplicationModel.findByPk(id);
    return model ? VaccineApplicationMapper.toDomain(model) : null;
  }

  async findAll(params: VaccineApplicationFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};
    if (params.consultationId) {
      where.consultationId = params.consultationId;
    }
    if (params.vaccineBatchId) {
      where.vaccineBatchId = params.vaccineBatchId;
    }
    if (params.search) {
      where.name = { [Op.like]: `%${params.search}%` };
    }

    const { rows, count } = await VaccineApplicationModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => VaccineApplicationMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
