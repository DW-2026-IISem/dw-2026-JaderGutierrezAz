import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVaccineBatchDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  vaccineId: number;

  @ApiProperty({ example: 'Lote A-2026-01' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Primer lote del año, laboratorio Zoetis' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
