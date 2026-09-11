import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OwnerResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'CC' })
  documentType: string;

  @ApiProperty({ example: '1001234567' })
  documentNumber: string;

  @ApiProperty({ example: 'Laura Gómez' })
  name: string;

  @ApiPropertyOptional({ example: '+57 300 1234567' })
  phone?: string;

  @ApiPropertyOptional({ example: 'laura.gomez@example.com' })
  email?: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}
