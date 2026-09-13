import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'APPOINTMENT' })
  referenceType: string;

  @ApiProperty({ example: 1 })
  referenceId: number;

  @ApiProperty({ example: 'EFECTIVO' })
  method: string;

  @ApiProperty({ example: 45000 })
  amount: number;

  @ApiProperty({ example: '2026-09-15T14:00:00.000Z' })
  date: Date;

  @ApiProperty({ example: 'PAGADO' })
  state: string;
}
