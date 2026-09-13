import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateRecipeDto } from './create-recipe.dto.js';

export class UpdateRecipeDto extends PartialType(
  OmitType(CreateRecipeDto, ['consultationId'] as const),
) {}
