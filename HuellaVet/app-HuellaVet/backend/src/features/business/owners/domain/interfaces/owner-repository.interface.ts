import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { Owner } from '../entities/owner.entity.js';

export const OWNER_REPOSITORY = 'OWNER_REPOSITORY';

export interface OwnerFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IOwnerRepository {
  create(owner: Owner): Promise<Owner>;
  update(owner: Owner): Promise<Owner>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Owner | null>;
  findByDocumentNumber(documentNumber: string): Promise<Owner | null>;
  findAll(params: OwnerFindAllParams): Promise<PaginatedResult<Owner>>;
}
