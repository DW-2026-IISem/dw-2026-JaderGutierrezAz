import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParsePositiveIntPipe } from '../../../../../../common/pipes/parse-positive-int.pipe.js';
import { CreatePaymentDto } from '../../../application/dto/create-payment.dto.js';
import { UpdatePaymentDto } from '../../../application/dto/update-payment.dto.js';
import { PaymentFilterDto } from '../../../application/dto/payment-filter.dto.js';
import { PaymentResponseDto } from '../../../application/dto/payment-response.dto.js';
import { CreatePaymentUseCase } from '../../../application/use-cases/create-payment.use-case.js';
import { UpdatePaymentUseCase } from '../../../application/use-cases/update-payment.use-case.js';
import { DeletePaymentUseCase } from '../../../application/use-cases/delete-payment.use-case.js';
import { GetPaymentUseCase } from '../../../application/use-cases/get-payment.use-case.js';
import { ListPaymentsUseCase } from '../../../application/use-cases/list-payments.use-case.js';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly updatePaymentUseCase: UpdatePaymentUseCase,
    private readonly deletePaymentUseCase: DeletePaymentUseCase,
    private readonly getPaymentUseCase: GetPaymentUseCase,
    private readonly listPaymentsUseCase: ListPaymentsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un pago' })
  @ApiCreatedResponse({ type: PaymentResponseDto })
  create(@Body() dto: CreatePaymentDto) {
    return this.createPaymentUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pagos' })
  @ApiOkResponse({ type: [PaymentResponseDto] })
  findAll(@Query() filter: PaymentFilterDto) {
    return this.listPaymentsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un pago por ID' })
  @ApiOkResponse({ type: PaymentResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getPaymentUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un pago' })
  @ApiOkResponse({ type: PaymentResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.updatePaymentUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un pago' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deletePaymentUseCase.execute(id);
  }
}
