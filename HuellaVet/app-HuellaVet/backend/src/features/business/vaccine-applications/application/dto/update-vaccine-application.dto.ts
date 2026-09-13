import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateVaccineApplicationDto } from './create-vaccine-application.dto.js';

export class UpdateVaccineApplicationDto extends PartialType(
  OmitType(CreateVaccineApplicationDto, ['consultationId', 'vaccineBatchId'] as const),
) {}
