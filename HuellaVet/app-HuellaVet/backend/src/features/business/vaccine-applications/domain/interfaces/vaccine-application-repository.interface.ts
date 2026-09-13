import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { VaccineApplication } from '../entities/vaccine-application.entity.js';

export const VACCINE_APPLICATION_REPOSITORY = 'VACCINE_APPLICATION_REPOSITORY';

export interface VaccineApplicationFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  consultationId?: number;
  vaccineBatchId?: number;
}

export interface IVaccineApplicationRepository {
  create(vaccineApplication: VaccineApplication): Promise<VaccineApplication>;
  update(vaccineApplication: VaccineApplication): Promise<VaccineApplication>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<VaccineApplication | null>;
  findAll(
    params: VaccineApplicationFindAllParams,
  ): Promise<PaginatedResult<VaccineApplication>>;
}
