import { Inject, Injectable } from '@nestjs/common';
import { AppointmentNotFoundException } from '../../../appointments/domain/exceptions/appointment-not-found.exception.js';
import {
  APPOINTMENT_REPOSITORY,
  type IAppointmentRepository,
} from '../../../appointments/domain/interfaces/appointment-repository.interface.js';
import { Payment, PaymentReferenceType } from '../../domain/entities/payment.entity.js';
import {
  PAYMENT_REPOSITORY,
  type IPaymentRepository,
} from '../../domain/interfaces/payment-repository.interface.js';
import { CreatePaymentDto } from '../dto/create-payment.dto.js';
import { PaymentMapper } from '../mappers/payment.mapper.js';

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async execute(dto: CreatePaymentDto) {
    // Única referencia soportada hoy: APPOINTMENT (declarada por el profesor).
    if (dto.referenceType === 'APPOINTMENT') {
      const appointment = await this.appointmentRepository.findById(dto.referenceId);
      if (!appointment) {
        throw new AppointmentNotFoundException(dto.referenceId);
      }
    }

    const payment = Payment.create({
      referenceType: dto.referenceType as PaymentReferenceType,
      referenceId: dto.referenceId,
      method: dto.method,
      amount: dto.amount,
      date: new Date(dto.date),
    });

    const created = await this.paymentRepository.create(payment);
    return PaymentMapper.toResponse(created);
  }
}
