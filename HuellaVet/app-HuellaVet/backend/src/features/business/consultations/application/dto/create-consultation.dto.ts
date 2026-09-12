import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateConsultationDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  appointmentId: number;

  @ApiProperty({ example: 'Consulta general' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Revisión de rutina derivada de la cita' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
