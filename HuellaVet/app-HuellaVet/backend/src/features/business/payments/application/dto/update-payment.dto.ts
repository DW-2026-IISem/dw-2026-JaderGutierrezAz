import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class UpdatePaymentDto {
  @ApiPropertyOptional({ example: 'TRANSFERENCIA' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  method?: string;

  @ApiPropertyOptional({ example: 50000 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @ApiPropertyOptional({ example: '2026-09-16T09:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: 'PAGADO' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  state?: string;
}
