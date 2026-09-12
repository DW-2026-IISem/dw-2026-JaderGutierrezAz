import { Consultation } from '../../../domain/entities/consultation.entity.js';
import { ConsultationResponseDto } from '../../../application/dto/consultation-response.dto.js';
import { ConsultationMapper } from '../../../application/mappers/consultation.mapper.js';

export class ConsultationSerializer {
  static serialize(entity: Consultation): ConsultationResponseDto {
    return ConsultationMapper.toResponse(entity);
  }
}
