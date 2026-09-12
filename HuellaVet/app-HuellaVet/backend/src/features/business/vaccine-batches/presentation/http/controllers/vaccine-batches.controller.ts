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
import { CreateVaccineBatchDto } from '../../../application/dto/create-vaccine-batch.dto.js';
import { UpdateVaccineBatchDto } from '../../../application/dto/update-vaccine-batch.dto.js';
import { VaccineBatchFilterDto } from '../../../application/dto/vaccine-batch-filter.dto.js';
import { VaccineBatchResponseDto } from '../../../application/dto/vaccine-batch-response.dto.js';
import { CreateVaccineBatchUseCase } from '../../../application/use-cases/create-vaccine-batch.use-case.js';
import { UpdateVaccineBatchUseCase } from '../../../application/use-cases/update-vaccine-batch.use-case.js';
import { DeleteVaccineBatchUseCase } from '../../../application/use-cases/delete-vaccine-batch.use-case.js';
import { GetVaccineBatchUseCase } from '../../../application/use-cases/get-vaccine-batch.use-case.js';
import { ListVaccineBatchesUseCase } from '../../../application/use-cases/list-vaccine-batches.use-case.js';

@ApiTags('VaccineBatches')
@Controller('vaccine-batches')
export class VaccineBatchesController {
  constructor(
    private readonly createVaccineBatchUseCase: CreateVaccineBatchUseCase,
    private readonly updateVaccineBatchUseCase: UpdateVaccineBatchUseCase,
    private readonly deleteVaccineBatchUseCase: DeleteVaccineBatchUseCase,
    private readonly getVaccineBatchUseCase: GetVaccineBatchUseCase,
    private readonly listVaccineBatchesUseCase: ListVaccineBatchesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un lote de vacuna' })
  @ApiCreatedResponse({ type: VaccineBatchResponseDto })
  create(@Body() dto: CreateVaccineBatchDto) {
    return this.createVaccineBatchUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar lotes de vacuna' })
  @ApiOkResponse({ type: [VaccineBatchResponseDto] })
  findAll(@Query() filter: VaccineBatchFilterDto) {
    return this.listVaccineBatchesUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un lote de vacuna por ID' })
  @ApiOkResponse({ type: VaccineBatchResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getVaccineBatchUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un lote de vacuna' })
  @ApiOkResponse({ type: VaccineBatchResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateVaccineBatchDto,
  ) {
    return this.updateVaccineBatchUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un lote de vacuna' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteVaccineBatchUseCase.execute(id);
  }
}
