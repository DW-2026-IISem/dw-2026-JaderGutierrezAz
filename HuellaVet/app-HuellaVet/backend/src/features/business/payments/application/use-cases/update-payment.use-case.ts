import { Inject, Injectable } from '@nestjs/common';
import { PaymentNotFoundException } from '../../domain/exceptions/payment-not-found.exception.js';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '../../domain/interfaces/payment-repository.interface.js';
import { UpdatePaymentDto } from '../dto/update-payment.dto.js';
import { PaymentMapper } from '../mappers/payment.mapper.js';

@Injectable()
export class UpdatePaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(id: number, dto: UpdatePaymentDto) {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new PaymentNotFoundException(id);
    }

    payment.update({
      method: dto.method,
      amount: dto.amount,
      date: dto.date ? new Date(dto.date) : undefined,
      state: dto.state,
    });

    const updated = await this.paymentRepository.update(payment);
    return PaymentMapper.toResponse(updated);
  }
}
