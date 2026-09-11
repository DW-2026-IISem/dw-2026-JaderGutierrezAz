import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Owner } from '../../../domain/entities/owner.entity.js';
import {
  OwnerFindAllParams,
  IOwnerRepository,
} from '../../../domain/interfaces/owner-repository.interface.js';
import { OwnerMapper } from '../../../application/mappers/owner.mapper.js';
import { OwnerModel } from '../models/owner.model.js';

@Injectable()
export class OwnerRepository implements IOwnerRepository {
  async create(owner: Owner): Promise<Owner> {
    const model = await OwnerModel.create(OwnerMapper.toPersistence(owner));
    return OwnerMapper.toDomain(model);
  }

  async update(owner: Owner): Promise<Owner> {
    await OwnerModel.update(OwnerMapper.toPersistence(owner), {
      where: { id: owner.id },
    });
    const updated = await OwnerModel.findByPk(owner.id!);
    return OwnerMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await OwnerModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Owner | null> {
    const model = await OwnerModel.findByPk(id);
    return model ? OwnerMapper.toDomain(model) : null;
  }

  async findByDocumentNumber(documentNumber: string): Promise<Owner | null> {
    const model = await OwnerModel.findOne({ where: { documentNumber } });
    return model ? OwnerMapper.toDomain(model) : null;
  }

  async findAll(params: OwnerFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where = params.search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${params.search}%` } },
            { documentNumber: { [Op.like]: `%${params.search}%` } },
          ],
        }
      : {};

    const { rows, count } = await OwnerModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => OwnerMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
