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
import { CreateOwnerDto } from '../../../application/dto/create-owner.dto.js';
import { UpdateOwnerDto } from '../../../application/dto/update-owner.dto.js';
import { OwnerFilterDto } from '../../../application/dto/owner-filter.dto.js';
import { OwnerResponseDto } from '../../../application/dto/owner-response.dto.js';
import { CreateOwnerUseCase } from '../../../application/use-cases/create-owner.use-case.js';
import { UpdateOwnerUseCase } from '../../../application/use-cases/update-owner.use-case.js';
import { DeleteOwnerUseCase } from '../../../application/use-cases/delete-owner.use-case.js';
import { GetOwnerUseCase } from '../../../application/use-cases/get-owner.use-case.js';
import { ListOwnersUseCase } from '../../../application/use-cases/list-owners.use-case.js';

@ApiTags('Owners')
@Controller('owners')
export class OwnersController {
  constructor(
    private readonly createOwnerUseCase: CreateOwnerUseCase,
    private readonly updateOwnerUseCase: UpdateOwnerUseCase,
    private readonly deleteOwnerUseCase: DeleteOwnerUseCase,
    private readonly getOwnerUseCase: GetOwnerUseCase,
    private readonly listOwnersUseCase: ListOwnersUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un propietario' })
  @ApiCreatedResponse({ type: OwnerResponseDto })
  create(@Body() dto: CreateOwnerDto) {
    return this.createOwnerUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar propietarios' })
  @ApiOkResponse({ type: [OwnerResponseDto] })
  findAll(@Query() filter: OwnerFilterDto) {
    return this.listOwnersUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un propietario por ID' })
  @ApiOkResponse({ type: OwnerResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getOwnerUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un propietario' })
  @ApiOkResponse({ type: OwnerResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateOwnerDto,
  ) {
    return this.updateOwnerUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un propietario' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteOwnerUseCase.execute(id);
  }
}
