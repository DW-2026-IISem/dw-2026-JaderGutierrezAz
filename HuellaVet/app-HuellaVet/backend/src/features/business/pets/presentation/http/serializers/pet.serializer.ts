import { Pet } from '../../../domain/entities/pet.entity.js';
import { PetResponseDto } from '../../../application/dto/pet-response.dto.js';
import { PetMapper } from '../../../application/mappers/pet.mapper.js';

export class PetSerializer {
  static serialize(entity: Pet): PetResponseDto {
    return PetMapper.toResponse(entity);
  }
}
