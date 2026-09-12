import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VaccineBatchResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  vaccineId: number;

  @ApiProperty({ example: 'Lote A-2026-01' })
  name: string;

  @ApiPropertyOptional({ example: 'Primer lote del año, laboratorio Zoetis' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  updatedAt: Date;
}
