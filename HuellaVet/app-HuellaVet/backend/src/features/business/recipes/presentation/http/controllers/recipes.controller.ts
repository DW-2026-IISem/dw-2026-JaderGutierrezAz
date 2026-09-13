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
import { CreateRecipeDto } from '../../../application/dto/create-recipe.dto.js';
import { UpdateRecipeDto } from '../../../application/dto/update-recipe.dto.js';
import { RecipeFilterDto } from '../../../application/dto/recipe-filter.dto.js';
import { RecipeResponseDto } from '../../../application/dto/recipe-response.dto.js';
import { CreateRecipeUseCase } from '../../../application/use-cases/create-recipe.use-case.js';
import { UpdateRecipeUseCase } from '../../../application/use-cases/update-recipe.use-case.js';
import { DeleteRecipeUseCase } from '../../../application/use-cases/delete-recipe.use-case.js';
import { GetRecipeUseCase } from '../../../application/use-cases/get-recipe.use-case.js';
import { ListRecipesUseCase } from '../../../application/use-cases/list-recipes.use-case.js';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly createRecipeUseCase: CreateRecipeUseCase,
    private readonly updateRecipeUseCase: UpdateRecipeUseCase,
    private readonly deleteRecipeUseCase: DeleteRecipeUseCase,
    private readonly getRecipeUseCase: GetRecipeUseCase,
    private readonly listRecipesUseCase: ListRecipesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una receta' })
  @ApiCreatedResponse({ type: RecipeResponseDto })
  create(@Body() dto: CreateRecipeDto) {
    return this.createRecipeUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar recetas' })
  @ApiOkResponse({ type: [RecipeResponseDto] })
  findAll(@Query() filter: RecipeFilterDto) {
    return this.listRecipesUseCase.execute(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una receta por ID' })
  @ApiOkResponse({ type: RecipeResponseDto })
  findOne(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.getRecipeUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una receta' })
  @ApiOkResponse({ type: RecipeResponseDto })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() dto: UpdateRecipeDto,
  ) {
    return this.updateRecipeUseCase.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una receta' })
  @ApiNoContentResponse()
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.deleteRecipeUseCase.execute(id);
  }
}
