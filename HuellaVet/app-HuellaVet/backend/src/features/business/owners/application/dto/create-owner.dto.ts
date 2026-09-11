import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateOwnerDto {
  @ApiProperty({ example: 'CC' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  documentType: string;

  @ApiProperty({ example: '1001234567' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  documentNumber: string;

  @ApiProperty({ example: 'Laura Gómez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: '+57 300 1234567' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'laura.gomez@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;
}
