import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Consultation } from '../../../domain/entities/consultation.entity.js';
import {
  ConsultationFindAllParams,
  IConsultationRepository,
} from '../../../domain/interfaces/consultation-repository.interface.js';
import { ConsultationMapper } from '../../../application/mappers/consultation.mapper.js';
import { ConsultationModel } from '../models/consultation.model.js';

@Injectable()
export class ConsultationRepository implements IConsultationRepository {
  async create(consultation: Consultation): Promise<Consultation> {
    const model = await ConsultationModel.create(
      ConsultationMapper.toPersistence(consultation),
    );
    return ConsultationMapper.toDomain(model);
  }

  async update(consultation: Consultation): Promise<Consultation> {
    await ConsultationModel.update(
      ConsultationMapper.toPersistence(consultation),
      { where: { id: consultation.id } },
    );
    const updated = await ConsultationModel.findByPk(consultation.id!);
    return ConsultationMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await ConsultationModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Consultation | null> {
    const model = await ConsultationModel.findByPk(id);
    return model ? ConsultationMapper.toDomain(model) : null;
  }

  async findByAppointmentId(appointmentId: number): Promise<Consultation | null> {
    const model = await ConsultationModel.findOne({ where: { appointmentId } });
    return model ? ConsultationMapper.toDomain(model) : null;
  }

  async findAll(params: ConsultationFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where = params.search
      ? { name: { [Op.like]: `%${params.search}%` } }
      : {};

    const { rows, count } = await ConsultationModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => ConsultationMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
