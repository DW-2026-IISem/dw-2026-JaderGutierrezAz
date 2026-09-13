import { Inject, Injectable } from '@nestjs/common';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '../../domain/interfaces/payment-repository.interface.js';
import { PaymentFilterDto } from '../dto/payment-filter.dto.js';
import { PaymentMapper } from '../mappers/payment.mapper.js';

@Injectable()
export class ListPaymentsUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(filter: PaymentFilterDto) {
    const result = await this.paymentRepository.findAll(filter);
    return {
      items: result.items.map((p) => PaymentMapper.toResponse(p)),
      meta: result.meta,
    };
  }
}
