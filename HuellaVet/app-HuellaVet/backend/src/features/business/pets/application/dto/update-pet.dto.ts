import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto.js';

export class UpdatePetDto extends PartialType(
  OmitType(CreatePetDto, ['ownerId'] as const),
) {}
