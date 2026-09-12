import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePetDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  ownerId: number;

  @ApiProperty({ example: 'Firulais' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Perro criollo, 3 años' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
