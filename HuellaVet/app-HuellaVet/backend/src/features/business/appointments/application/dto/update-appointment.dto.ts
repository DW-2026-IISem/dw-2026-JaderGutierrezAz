import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateAppointmentDto {
  @ApiPropertyOptional({ example: '2026-09-15T15:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-09-15T15:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 'Control preventivo' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  reason?: string;

  @ApiPropertyOptional({ example: 'CONFIRMADA' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  state?: string;
}
