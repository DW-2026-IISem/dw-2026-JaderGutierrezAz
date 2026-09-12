import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { Consultation } from '../entities/consultation.entity.js';

export const CONSULTATION_REPOSITORY = 'CONSULTATION_REPOSITORY';

export interface ConsultationFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IConsultationRepository {
  create(consultation: Consultation): Promise<Consultation>;
  update(consultation: Consultation): Promise<Consultation>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Consultation | null>;
  findByAppointmentId(appointmentId: number): Promise<Consultation | null>;
  findAll(params: ConsultationFindAllParams): Promise<PaginatedResult<Consultation>>;
}
