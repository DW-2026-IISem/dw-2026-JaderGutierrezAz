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
import { CreateVaccineApplicationDto } from '../../../application/dto/create-vaccine-application.dto.js';
import { UpdateVaccineApplicationDto } from '../../../application/dto/update-vaccine-application.dto.js';
import { VaccineApplicationFilterDto } from '../../../application/dto/vaccine-application-filter.dto.js';
import { VaccineApplicationResponseDto } from '../../../application/dto/vaccine-application-response.dto.js';
import { CreateVaccineApplicationUseCase } from '../../../application/use-cases/create-vaccine-application.use-case.js';
import { UpdateVaccineApplicationUseCase } from '../../../application/use-cases/update-vaccine-application.use-case.js';
import { DeleteVaccineApplicationUseCase } from '../../../application/use-cases/delete-vaccine-application.use-case.js';
import { GetVaccineApplicationUseCase } from '../../../application/use-cases/get-vaccine-application.use-case.js';
import { ListVaccineApplicationsUseCase } from '../../../application/use-cases/list-vaccine-applications.use-case.js';

@ApiTags('VaccineApplications')
@Controller('vaccine-applications')
export class VaccineApplicationsController {
  constructor(
    private readonly createVaccineApplicationUseCase: CreateVaccineApplicationUseCase,
    private readonly updateVaccineApplicationUseCase: UpdateVaccineApplicationUseCase,
    private readonly deleteVaccineApplicationUseCase: DeleteVaccineApplicationUseCase,
    private readonly getVaccineApplicationUseCase: GetVaccineApplicationUseCase,
    private readonly listVaccineApplicationsUseCase: ListVaccineApplicationsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una aplicación de vacuna' })
  @ApiCreatedResponse({ type: VaccineApplicationResponseDto })
  create(@Body() dto: CreateVaccineApplicationDto) {
    return this.createVaccineApplicationUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar aplicaciones de vacuna' })
  @ApiOkResponse({ type: [VaccineApplicationResponseDto] })
  findAll(@Query() filter: VaccineApplicationFilterDto) {
    return this.listVaccineApplicationsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una aplicación de vacuna por ID' })
  @ApiOkResponse({ type: VaccineApplicationResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getVaccineApplicationUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una aplicación de vacuna' })
  @ApiOkResponse({ type: VaccineApplicationResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateVaccineApplicationDto,
  ) {
    return this.updateVaccineApplicationUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una aplicación de vacuna' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteVaccineApplicationUseCase.execute(id);
  }
}
