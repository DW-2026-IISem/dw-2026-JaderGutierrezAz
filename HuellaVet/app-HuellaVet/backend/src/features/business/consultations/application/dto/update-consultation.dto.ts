import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateConsultationDto } from './create-consultation.dto.js';

export class UpdateConsultationDto extends PartialType(
  OmitType(CreateConsultationDto, ['appointmentId'] as const),
) {}
