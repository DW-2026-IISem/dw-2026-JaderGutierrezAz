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
import { CreateVaccineDto } from '../../../application/dto/create-vaccine.dto.js';
import { UpdateVaccineDto } from '../../../application/dto/update-vaccine.dto.js';
import { VaccineFilterDto } from '../../../application/dto/vaccine-filter.dto.js';
import { VaccineResponseDto } from '../../../application/dto/vaccine-response.dto.js';
import { CreateVaccineUseCase } from '../../../application/use-cases/create-vaccine.use-case.js';
import { UpdateVaccineUseCase } from '../../../application/use-cases/update-vaccine.use-case.js';
import { DeleteVaccineUseCase } from '../../../application/use-cases/delete-vaccine.use-case.js';
import { GetVaccineUseCase } from '../../../application/use-cases/get-vaccine.use-case.js';
import { ListVaccinesUseCase } from '../../../application/use-cases/list-vaccines.use-case.js';

@ApiTags('Vaccines')
@Controller('vaccines')
export class VaccinesController {
  constructor(
    private readonly createVaccineUseCase: CreateVaccineUseCase,
    private readonly updateVaccineUseCase: UpdateVaccineUseCase,
    private readonly deleteVaccineUseCase: DeleteVaccineUseCase,
    private readonly getVaccineUseCase: GetVaccineUseCase,
    private readonly listVaccinesUseCase: ListVaccinesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una vacuna' })
  @ApiCreatedResponse({ type: VaccineResponseDto })
  create(@Body() dto: CreateVaccineDto) {
    return this.createVaccineUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar vacunas' })
  @ApiOkResponse({ type: [VaccineResponseDto] })
  findAll(@Query() filter: VaccineFilterDto) {
    return this.listVaccinesUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una vacuna por ID' })
  @ApiOkResponse({ type: VaccineResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getVaccineUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una vacuna' })
  @ApiOkResponse({ type: VaccineResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateVaccineDto,
  ) {
    return this.updateVaccineUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una vacuna' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteVaccineUseCase.execute(id);
  }
}
