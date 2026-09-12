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
import { CreateAppointmentDto } from '../../../application/dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from '../../../application/dto/update-appointment.dto.js';
import { AppointmentFilterDto } from '../../../application/dto/appointment-filter.dto.js';
import { AppointmentResponseDto } from '../../../application/dto/appointment-response.dto.js';
import { CreateAppointmentUseCase } from '../../../application/use-cases/create-appointment.use-case.js';
import { UpdateAppointmentUseCase } from '../../../application/use-cases/update-appointment.use-case.js';
import { DeleteAppointmentUseCase } from '../../../application/use-cases/delete-appointment.use-case.js';
import { GetAppointmentUseCase } from '../../../application/use-cases/get-appointment.use-case.js';
import { ListAppointmentsUseCase } from '../../../application/use-cases/list-appointments.use-case.js';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
    private readonly updateAppointmentUseCase: UpdateAppointmentUseCase,
    private readonly deleteAppointmentUseCase: DeleteAppointmentUseCase,
    private readonly getAppointmentUseCase: GetAppointmentUseCase,
    private readonly listAppointmentsUseCase: ListAppointmentsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Agendar una cita' })
  @ApiCreatedResponse({ type: AppointmentResponseDto })
  create(@Body() dto: CreateAppointmentDto) {
    return this.createAppointmentUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar citas' })
  @ApiOkResponse({ type: [AppointmentResponseDto] })
  findAll(@Query() filter: AppointmentFilterDto) {
    return this.listAppointmentsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una cita por ID' })
  @ApiOkResponse({ type: AppointmentResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getAppointmentUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una cita' })
  @ApiOkResponse({ type: AppointmentResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.updateAppointmentUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una cita' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteAppointmentUseCase.execute(id);
  }
}
