import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'APPOINTMENT', enum: ['APPOINTMENT'] })
  @IsIn(['APPOINTMENT'])
  referenceType: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  referenceId: number;

  @ApiProperty({ example: 'EFECTIVO' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  method: string;

  @ApiProperty({ example: 45000 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: '2026-09-15T14:00:00.000Z' })
  @IsDateString()
  date: string;
}
