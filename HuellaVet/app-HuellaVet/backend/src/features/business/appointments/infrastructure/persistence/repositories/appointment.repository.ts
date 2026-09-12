import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Appointment } from '../../../domain/entities/appointment.entity.js';
import {
  AppointmentFindAllParams,
  IAppointmentRepository,
} from '../../../domain/interfaces/appointment-repository.interface.js';
import { AppointmentMapper } from '../../../application/mappers/appointment.mapper.js';
import { AppointmentModel } from '../models/appointment.model.js';

@Injectable()
export class AppointmentRepository implements IAppointmentRepository {
  async create(appointment: Appointment): Promise<Appointment> {
    const model = await AppointmentModel.create(
      AppointmentMapper.toPersistence(appointment),
    );
    return AppointmentMapper.toDomain(model);
  }

  async update(appointment: Appointment): Promise<Appointment> {
    await AppointmentModel.update(
      AppointmentMapper.toPersistence(appointment),
      { where: { id: appointment.id } },
    );
    const updated = await AppointmentModel.findByPk(appointment.id!);
    return AppointmentMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await AppointmentModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Appointment | null> {
    const model = await AppointmentModel.findByPk(id);
    return model ? AppointmentMapper.toDomain(model) : null;
  }

  async findAll(params: AppointmentFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};
    if (params.petId) {
      where.petId = params.petId;
    }
    if (params.veterinarianId) {
      where.veterinarianId = params.veterinarianId;
    }

    const { rows, count } = await AppointmentModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['startDate', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => AppointmentMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }

  async findOverlapping(
    veterinarianId: number,
    startDate: Date,
    endDate: Date,
    excludeId?: number,
  ): Promise<Appointment[]> {
    const where: Record<string, unknown> = {
      veterinarianId,
      startDate: { [Op.lt]: endDate },
      endDate: { [Op.gt]: startDate },
    };

    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const rows = await AppointmentModel.findAll({ where });
    return rows.map((row) => AppointmentMapper.toDomain(row));
  }
}
