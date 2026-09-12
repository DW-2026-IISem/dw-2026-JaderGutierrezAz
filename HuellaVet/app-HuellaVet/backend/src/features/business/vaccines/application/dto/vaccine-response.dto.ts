import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VaccineResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Antirrábica' })
  name: string;

  @ApiPropertyOptional({ example: 'Prevención de rabia canina y felina' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  updatedAt: Date;
}
