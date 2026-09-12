import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateVaccineBatchDto } from './create-vaccine-batch.dto.js';

export class UpdateVaccineBatchDto extends PartialType(
  OmitType(CreateVaccineBatchDto, ['vaccineId'] as const),
) {}
