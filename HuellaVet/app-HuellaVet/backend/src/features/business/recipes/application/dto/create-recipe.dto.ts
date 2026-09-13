import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  consultationId: number;

  @ApiProperty({ example: 'Receta post-consulta' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Indicaciones y tratamiento derivados de la consulta' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
