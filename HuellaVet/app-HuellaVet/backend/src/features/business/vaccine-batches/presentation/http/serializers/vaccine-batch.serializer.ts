import { VaccineBatch } from '../../../domain/entities/vaccine-batch.entity.js';
import { VaccineBatchResponseDto } from '../../../application/dto/vaccine-batch-response.dto.js';
import { VaccineBatchMapper } from '../../../application/mappers/vaccine-batch.mapper.js';

export class VaccineBatchSerializer {
  static serialize(entity: VaccineBatch): VaccineBatchResponseDto {
    return VaccineBatchMapper.toResponse(entity);
  }
}
