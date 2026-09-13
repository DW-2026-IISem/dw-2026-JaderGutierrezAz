import { Inject, Injectable } from '@nestjs/common';
import { PaymentNotFoundException } from '../../domain/exceptions/payment-not-found.exception.js';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '../../domain/interfaces/payment-repository.interface.js';

@Injectable()
export class DeletePaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new PaymentNotFoundException(id);
    }

    await this.paymentRepository.delete(id);
  }
}
