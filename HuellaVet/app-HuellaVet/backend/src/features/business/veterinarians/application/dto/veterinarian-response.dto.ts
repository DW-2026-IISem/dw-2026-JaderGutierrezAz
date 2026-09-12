import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VeterinarianResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Dra. Ana Martínez' })
  name: string;

  @ApiPropertyOptional({ example: 'Medicina general y vacunación' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  updatedAt: Date;
}
