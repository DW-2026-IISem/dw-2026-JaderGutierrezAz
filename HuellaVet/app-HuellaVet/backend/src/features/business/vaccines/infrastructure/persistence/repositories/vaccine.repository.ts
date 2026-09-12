import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Vaccine } from '../../../domain/entities/vaccine.entity.js';
import {
  VaccineFindAllParams,
  IVaccineRepository,
} from '../../../domain/interfaces/vaccine-repository.interface.js';
import { VaccineMapper } from '../../../application/mappers/vaccine.mapper.js';
import { VaccineModel } from '../models/vaccine.model.js';

@Injectable()
export class VaccineRepository implements IVaccineRepository {
  async create(vaccine: Vaccine): Promise<Vaccine> {
    const model = await VaccineModel.create(VaccineMapper.toPersistence(vaccine));
    return VaccineMapper.toDomain(model);
  }

  async update(vaccine: Vaccine): Promise<Vaccine> {
    await VaccineModel.update(VaccineMapper.toPersistence(vaccine), {
      where: { id: vaccine.id },
    });
    const updated = await VaccineModel.findByPk(vaccine.id!);
    return VaccineMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await VaccineModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Vaccine | null> {
    const model = await VaccineModel.findByPk(id);
    return model ? VaccineMapper.toDomain(model) : null;
  }

  async findAll(params: VaccineFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where = params.search
      ? { name: { [Op.like]: `%${params.search}%` } }
      : {};

    const { rows, count } = await VaccineModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => VaccineMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
