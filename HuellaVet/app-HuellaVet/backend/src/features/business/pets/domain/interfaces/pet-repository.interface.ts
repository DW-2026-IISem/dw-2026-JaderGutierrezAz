import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { Pet } from '../entities/pet.entity.js';

export const PET_REPOSITORY = 'PET_REPOSITORY';

export interface PetFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  ownerId?: number;
}

export interface IPetRepository {
  create(pet: Pet): Promise<Pet>;
  update(pet: Pet): Promise<Pet>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Pet | null>;
  findAll(params: PetFindAllParams): Promise<PaginatedResult<Pet>>;
}
