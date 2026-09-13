import { Injectable } from '@nestjs/common';
import {
  buildPaginatedResult,
  normalizePagination,
} from '../../../../../../common/utils/pagination.util.js';
import { Payment } from '../../../domain/entities/payment.entity.js';
import {
  PaymentFindAllParams,
  IPaymentRepository,
} from '../../../domain/interfaces/payment-repository.interface.js';
import { PaymentMapper } from '../../../application/mappers/payment.mapper.js';
import { PaymentModel } from '../models/payment.model.js';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  async create(payment: Payment): Promise<Payment> {
    const model = await PaymentModel.create(PaymentMapper.toPersistence(payment));
    return PaymentMapper.toDomain(model);
  }

  async update(payment: Payment): Promise<Payment> {
    await PaymentModel.update(PaymentMapper.toPersistence(payment), {
      where: { id: payment.id },
    });
    const updated = await PaymentModel.findByPk(payment.id!);
    return PaymentMapper.toDomain(updated!);
  }

  async delete(id: number): Promise<void> {
    await PaymentModel.destroy({ where: { id } });
  }

  async findById(id: number): Promise<Payment | null> {
    const model = await PaymentModel.findByPk(id);
    return model ? PaymentMapper.toDomain(model) : null;
  }

  async findAll(params: PaymentFindAllParams) {
    const { page, limit, offset } = normalizePagination(
      params.page,
      params.limit,
    );

    const where: Record<string, unknown> = {};
    if (params.referenceType) {
      where.referenceType = params.referenceType;
    }
    if (params.referenceId) {
      where.referenceId = params.referenceId;
    }

    const { rows, count } = await PaymentModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    });

    return buildPaginatedResult(
      rows.map((row) => PaymentMapper.toDomain(row)),
      count,
      page,
      limit,
    );
  }
}
