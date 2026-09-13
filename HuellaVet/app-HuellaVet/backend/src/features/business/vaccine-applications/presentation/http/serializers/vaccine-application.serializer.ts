import { VaccineApplication } from '../../../domain/entities/vaccine-application.entity.js';
import { VaccineApplicationResponseDto } from '../../../application/dto/vaccine-application-response.dto.js';
import { VaccineApplicationMapper } from '../../../application/mappers/vaccine-application.mapper.js';

export class VaccineApplicationSerializer {
  static serialize(entity: VaccineApplication): VaccineApplicationResponseDto {
    return VaccineApplicationMapper.toResponse(entity);
  }
}
