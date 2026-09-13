import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VaccineApplicationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  consultationId: number;

  @ApiProperty({ example: 1 })
  vaccineBatchId: number;

  @ApiProperty({ example: 'Aplicación antirrábica inicial' })
  name: string;

  @ApiPropertyOptional({ example: 'Primera dosis aplicada durante la consulta' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  updatedAt: Date;
}
