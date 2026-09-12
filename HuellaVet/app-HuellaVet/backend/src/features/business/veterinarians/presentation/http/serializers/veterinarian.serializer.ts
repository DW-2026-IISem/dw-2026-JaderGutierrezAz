import { Veterinarian } from '../../../domain/entities/veterinarian.entity.js';
import { VeterinarianResponseDto } from '../../../application/dto/veterinarian-response.dto.js';
import { VeterinarianMapper } from '../../../application/mappers/veterinarian.mapper.js';

export class VeterinarianSerializer {
  static serialize(entity: Veterinarian): VeterinarianResponseDto {
    return VeterinarianMapper.toResponse(entity);
  }
}
