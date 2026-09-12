import { Inject, Injectable } from '@nestjs/common';
import {
  CONSULTATION_REPOSITORY,
  type IConsultationRepository,
} from '../../domain/interfaces/consultation-repository.interface.js';
import { ConsultationFilterDto } from '../dto/consultation-filter.dto.js';
import { ConsultationMapper } from '../mappers/consultation.mapper.js';

@Injectable()
export class ListConsultationsUseCase {
  constructor(
    @Inject(CONSULTATION_REPOSITORY)
    private readonly consultationRepository: IConsultationRepository,
  ) {}

  async execute(filter: ConsultationFilterDto) {
    const result = await this.consultationRepository.findAll(filter);
    return {
      items: result.items.map((c) => ConsultationMapper.toResponse(c)),
      meta: result.meta,
    };
  }
}
