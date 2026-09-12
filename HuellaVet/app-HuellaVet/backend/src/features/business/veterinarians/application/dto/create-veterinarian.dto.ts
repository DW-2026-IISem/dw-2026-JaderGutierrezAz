import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateVeterinarianDto {
  @ApiProperty({ example: 'Dra. Ana Martínez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Medicina general y vacunación' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
