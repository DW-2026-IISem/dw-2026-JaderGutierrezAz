import { Module } from '@nestjs/common';
import { AppointmentsModule } from '../appointments/appointments.module.js';
import { PAYMENT_REPOSITORY } from './domain/interfaces/payment-repository.interface.js';
import { PaymentRepository } from './infrastructure/persistence/repositories/payment.repository.js';
import { CreatePaymentUseCase } from './application/use-cases/create-payment.use-case.js';
import { UpdatePaymentUseCase } from './application/use-cases/update-payment.use-case.js';
import { DeletePaymentUseCase } from './application/use-cases/delete-payment.use-case.js';
import { GetPaymentUseCase } from './application/use-cases/get-payment.use-case.js';
import { ListPaymentsUseCase } from './application/use-cases/list-payments.use-case.js';
import { PaymentsController } from './presentation/http/controllers/payments.controller.js';

@Module({
  imports: [AppointmentsModule],
  controllers: [PaymentsController],
  providers: [
    PaymentRepository,
    { provide: PAYMENT_REPOSITORY, useExisting: PaymentRepository },
    CreatePaymentUseCase,
    UpdatePaymentUseCase,
    DeletePaymentUseCase,
    GetPaymentUseCase,
    ListPaymentsUseCase,
  ],
  exports: [PAYMENT_REPOSITORY],
})
export class PaymentsModule {}
