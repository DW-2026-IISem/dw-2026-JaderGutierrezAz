import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  petId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  veterinarianId: number;

  @ApiProperty({ example: '2026-09-15T14:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-09-15T14:30:00.000Z' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ example: 'Control preventivo' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;
}
