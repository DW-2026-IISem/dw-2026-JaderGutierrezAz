import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PetResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  ownerId: number;

  @ApiProperty({ example: 'Firulais' })
  name: string;

  @ApiPropertyOptional({ example: 'Perro criollo, 3 años' })
  description?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-09-11T20:00:00.000Z' })
  updatedAt: Date;
}
