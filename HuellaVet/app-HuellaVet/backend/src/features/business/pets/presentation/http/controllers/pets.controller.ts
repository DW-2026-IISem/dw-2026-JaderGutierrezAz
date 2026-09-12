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
import { CreatePetDto } from '../../../application/dto/create-pet.dto.js';
import { UpdatePetDto } from '../../../application/dto/update-pet.dto.js';
import { PetFilterDto } from '../../../application/dto/pet-filter.dto.js';
import { PetResponseDto } from '../../../application/dto/pet-response.dto.js';
import { CreatePetUseCase } from '../../../application/use-cases/create-pet.use-case.js';
import { UpdatePetUseCase } from '../../../application/use-cases/update-pet.use-case.js';
import { DeletePetUseCase } from '../../../application/use-cases/delete-pet.use-case.js';
import { GetPetUseCase } from '../../../application/use-cases/get-pet.use-case.js';
import { ListPetsUseCase } from '../../../application/use-cases/list-pets.use-case.js';

@ApiTags('Pets')
@Controller('pets')
export class PetsController {
  constructor(
    private readonly createPetUseCase: CreatePetUseCase,
    private readonly updatePetUseCase: UpdatePetUseCase,
    private readonly deletePetUseCase: DeletePetUseCase,
    private readonly getPetUseCase: GetPetUseCase,
    private readonly listPetsUseCase: ListPetsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una mascota' })
  @ApiCreatedResponse({ type: PetResponseDto })
  create(@Body() dto: CreatePetDto) {
    return this.createPetUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar mascotas' })
  @ApiOkResponse({ type: [PetResponseDto] })
  findAll(@Query() filter: PetFilterDto) {
    return this.listPetsUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una mascota por ID' })
  @ApiOkResponse({ type: PetResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getPetUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una mascota' })
  @ApiOkResponse({ type: PetResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdatePetDto,
  ) {
    return this.updatePetUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una mascota' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deletePetUseCase.execute(id);
  }
}
