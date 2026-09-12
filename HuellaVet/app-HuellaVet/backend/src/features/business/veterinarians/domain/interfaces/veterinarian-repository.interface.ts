import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { Veterinarian } from '../entities/veterinarian.entity.js';

export const VETERINARIAN_REPOSITORY = 'VETERINARIAN_REPOSITORY';

export interface VeterinarianFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IVeterinarianRepository {
  create(veterinarian: Veterinarian): Promise<Veterinarian>;
  update(veterinarian: Veterinarian): Promise<Veterinarian>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Veterinarian | null>;
  findAll(params: VeterinarianFindAllParams): Promise<PaginatedResult<Veterinarian>>;
}
