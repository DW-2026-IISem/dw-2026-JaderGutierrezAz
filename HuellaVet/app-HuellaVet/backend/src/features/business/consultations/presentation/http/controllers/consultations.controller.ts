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
import { CreateConsultationDto } from '../../../application/dto/create-consultation.dto.js';
import { UpdateConsultationDto } from '../../../application/dto/update-consultation.dto.js';
import { ConsultationFilterDto } from '../../../application/dto/consultation-filter.dto.js';
import { ConsultationResponseDto } from '../../../application/dto/consultation-response.dto.js';
import { CreateConsultationUseCase } from '../../../application/use-cases/create-consultation.use-case.js';
import { UpdateConsultationUseCase } from '../../../application/use-cases/update-consultation.use-case.js';
import { DeleteConsultationUseCase } from '../../../application/use-cases/delete-consultation.use-case.js';
import { GetConsultationUseCase } from '../../../application/use-cases/get-consultation.use-case.js';
import { ListConsultationsUseCase } from '../../../application/use-cases/list-consultations.use-case.js';

@ApiTags('Consultations')
@Controller('consultations')
export class ConsultationsController {
  constructor(
    private readonly createConsultationUseCase: CreateConsultationUseCase,
    private readonly updateConsultationUseCase: UpdateConsultationUseCase,
    private readonly deleteConsultationUseCase: DeleteConsultationUseCase,
    private readonly getConsultationUseCase: GetConsultationUseCase,
    private readonly listConsultationsUseCase: ListConsultationsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una consulta' })
  @ApiCreatedResponse({ type: ConsultationResponseDto })
  create(@Body() dto: CreateConsultationDto) {
    return this.createConsultationUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar consultas' })
  @ApiOkResponse({ type: [ConsultationResponseDto] })
  findAll(@Query() filter: ConsultationFilterDto) {
    return this.listConsultationsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una consulta por ID' })
  @ApiOkResponse({ type: ConsultationResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getConsultationUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una consulta' })
  @ApiOkResponse({ type: ConsultationResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateConsultationDto,
  ) {
    return this.updateConsultationUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una consulta' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteConsultationUseCase.execute(id);
  }
}
