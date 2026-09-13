import { Payment, PaymentReferenceType } from '../../domain/entities/payment.entity.js';
import { PaymentResponseDto } from '../dto/payment-response.dto.js';
import { PaymentModel } from '../../infrastructure/persistence/models/payment.model.js';

export class PaymentMapper {
  static toDomain(model: PaymentModel): Payment {
    return Payment.reconstitute({
      id: model.id,
      referenceType: model.referenceType as PaymentReferenceType,
      referenceId: model.referenceId,
      method: model.method,
      amount: Number(model.amount),
      date: model.date,
      state: model.state,
    });
  }

  static toResponse(entity: Payment): PaymentResponseDto {
    return {
      id: entity.id!,
      referenceType: entity.referenceType,
      referenceId: entity.referenceId,
      method: entity.method,
      amount: entity.amount,
      date: entity.date,
      state: entity.state,
    };
  }

  static toPersistence(entity: Payment): Partial<PaymentModel> {
    return {
      id: entity.id,
      referenceType: entity.referenceType,
      referenceId: entity.referenceId,
      method: entity.method,
      amount: entity.amount,
      date: entity.date,
      state: entity.state,
    };
  }
}
