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
import { CreateVeterinarianDto } from '../../../application/dto/create-veterinarian.dto.js';
import { UpdateVeterinarianDto } from '../../../application/dto/update-veterinarian.dto.js';
import { VeterinarianFilterDto } from '../../../application/dto/veterinarian-filter.dto.js';
import { VeterinarianResponseDto } from '../../../application/dto/veterinarian-response.dto.js';
import { CreateVeterinarianUseCase } from '../../../application/use-cases/create-veterinarian.use-case.js';
import { UpdateVeterinarianUseCase } from '../../../application/use-cases/update-veterinarian.use-case.js';
import { DeleteVeterinarianUseCase } from '../../../application/use-cases/delete-veterinarian.use-case.js';
import { GetVeterinarianUseCase } from '../../../application/use-cases/get-veterinarian.use-case.js';
import { ListVeterinariansUseCase } from '../../../application/use-cases/list-veterinarians.use-case.js';

@ApiTags('Veterinarians')
@Controller('veterinarians')
export class VeterinariansController {
  constructor(
    private readonly createVeterinarianUseCase: CreateVeterinarianUseCase,
    private readonly updateVeterinarianUseCase: UpdateVeterinarianUseCase,
    private readonly deleteVeterinarianUseCase: DeleteVeterinarianUseCase,
    private readonly getVeterinarianUseCase: GetVeterinarianUseCase,
    private readonly listVeterinariansUseCase: ListVeterinariansUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un veterinario' })
  @ApiCreatedResponse({ type: VeterinarianResponseDto })
  create(@Body() dto: CreateVeterinarianDto) {
    return this.createVeterinarianUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar veterinarios' })
  @ApiOkResponse({ type: [VeterinarianResponseDto] })
  findAll(@Query() filter: VeterinarianFilterDto) {
    return this.listVeterinariansUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un veterinario por ID' })
  @ApiOkResponse({ type: VeterinarianResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getVeterinarianUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un veterinario' })
  @ApiOkResponse({ type: VeterinarianResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateVeterinarianDto,
  ) {
    return this.updateVeterinarianUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un veterinario' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteVeterinarianUseCase.execute(id);
  }
}
