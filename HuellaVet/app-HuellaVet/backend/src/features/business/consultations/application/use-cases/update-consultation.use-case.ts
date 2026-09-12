import { Inject, Injectable } from '@nestjs/common';
import { ConsultationNotFoundException } from '../../domain/exceptions/consultation-not-found.exception.js';
import {
  CONSULTATION_REPOSITORY,
  type IConsultationRepository,
} from '../../domain/interfaces/consultation-repository.interface.js';
import { UpdateConsultationDto } from '../dto/update-consultation.dto.js';
import { ConsultationMapper } from '../mappers/consultation.mapper.js';

@Injectable()
export class UpdateConsultationUseCase {
  constructor(
    @Inject(CONSULTATION_REPOSITORY)
    private readonly consultationRepository: IConsultationRepository,
  ) {}

  async execute(id: number, dto: UpdateConsultationDto) {
    const consultation = await this.consultationRepository.findById(id);
    if (!consultation) {
      throw new ConsultationNotFoundException(id);
    }

    consultation.update(dto);
    const updated = await this.consultationRepository.update(consultation);
    return ConsultationMapper.toResponse(updated);
  }
}
