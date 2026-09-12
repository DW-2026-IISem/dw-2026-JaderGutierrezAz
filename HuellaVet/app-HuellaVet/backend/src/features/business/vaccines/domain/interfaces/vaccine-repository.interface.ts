import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { Vaccine } from '../entities/vaccine.entity.js';

export const VACCINE_REPOSITORY = 'VACCINE_REPOSITORY';

export interface VaccineFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IVaccineRepository {
  create(vaccine: Vaccine): Promise<Vaccine>;
  update(vaccine: Vaccine): Promise<Vaccine>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Vaccine | null>;
  findAll(params: VaccineFindAllParams): Promise<PaginatedResult<Vaccine>>;
}
