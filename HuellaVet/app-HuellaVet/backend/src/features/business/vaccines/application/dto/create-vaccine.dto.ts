import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVaccineDto {
  @ApiProperty({ example: 'Antirrábica' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Prevención de rabia canina y felina' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
