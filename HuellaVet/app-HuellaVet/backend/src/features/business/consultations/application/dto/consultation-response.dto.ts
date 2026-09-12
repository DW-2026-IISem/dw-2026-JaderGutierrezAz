import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConsultationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  appointmentId: number;

  @ApiProperty({ example: 'Consulta general' })
  name: string;

  @ApiPropertyOptional({ example: 'Revisión de rutina derivada de la cita' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  updatedAt: Date;
}
