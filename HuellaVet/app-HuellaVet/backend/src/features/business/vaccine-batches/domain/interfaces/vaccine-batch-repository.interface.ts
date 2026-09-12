import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { VaccineBatch } from '../entities/vaccine-batch.entity.js';

export const VACCINE_BATCH_REPOSITORY = 'VACCINE_BATCH_REPOSITORY';

export interface VaccineBatchFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  vaccineId?: number;
}

export interface IVaccineBatchRepository {
  create(vaccineBatch: VaccineBatch): Promise<VaccineBatch>;
  update(vaccineBatch: VaccineBatch): Promise<VaccineBatch>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<VaccineBatch | null>;
  findAll(params: VaccineBatchFindAllParams): Promise<PaginatedResult<VaccineBatch>>;
}
