import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVaccineApplicationDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  consultationId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  vaccineBatchId: number;

  @ApiProperty({ example: 'Aplicación antirrábica inicial' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Primera dosis aplicada durante la consulta' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
