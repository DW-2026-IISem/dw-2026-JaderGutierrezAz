import { Vaccine } from '../../../domain/entities/vaccine.entity.js';
import { VaccineResponseDto } from '../../../application/dto/vaccine-response.dto.js';
import { VaccineMapper } from '../../../application/mappers/vaccine.mapper.js';

export class VaccineSerializer {
  static serialize(entity: Vaccine): VaccineResponseDto {
    return VaccineMapper.toResponse(entity);
  }
}
