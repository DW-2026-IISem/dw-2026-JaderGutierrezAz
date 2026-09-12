import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AppointmentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  petId: number;

  @ApiProperty({ example: 1 })
  veterinarianId: number;

  @ApiProperty({ example: '2026-09-15T14:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: '2026-09-15T14:30:00.000Z' })
  endDate: Date;

  @ApiPropertyOptional({ example: 'Control preventivo' })
  reason?: string;

  @ApiProperty({ example: 'PENDIENTE' })
  state: string;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  updatedAt: Date;
}
