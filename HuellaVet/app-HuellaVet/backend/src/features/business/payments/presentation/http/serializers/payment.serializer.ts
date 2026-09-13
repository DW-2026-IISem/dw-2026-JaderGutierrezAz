import { Payment } from '../../../domain/entities/payment.entity.js';
import { PaymentResponseDto } from '../../../application/dto/payment-response.dto.js';
import { PaymentMapper } from '../../../application/mappers/payment.mapper.js';

export class PaymentSerializer {
  static serialize(entity: Payment): PaymentResponseDto {
    return PaymentMapper.toResponse(entity);
  }
}
