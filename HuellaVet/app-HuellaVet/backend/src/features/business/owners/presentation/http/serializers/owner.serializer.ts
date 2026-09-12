import { Owner } from '../../../domain/entities/owner.entity.js';
import { OwnerResponseDto } from '../../../application/dto/owner-response.dto.js';
import { OwnerMapper } from '../../../application/mappers/owner.mapper.js';

export class OwnerSerializer {
  static serialize(entity: Owner): OwnerResponseDto {
    return OwnerMapper.toResponse(entity);
  }
}
