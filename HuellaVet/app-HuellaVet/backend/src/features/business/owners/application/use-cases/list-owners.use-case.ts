import { Inject, Injectable } from '@nestjs/common';
import {
  OWNER_REPOSITORY,
  type IOwnerRepository,
} from '../../domain/interfaces/owner-repository.interface.js';
import { OwnerFilterDto } from '../dto/owner-filter.dto.js';
import { OwnerMapper } from '../mappers/owner.mapper.js';

@Injectable()
export class ListOwnersUseCase {
  constructor(
    @Inject(OWNER_REPOSITORY)
    private readonly ownerRepository: IOwnerRepository,
  ) {}

  async execute(filter: OwnerFilterDto) {
    const result = await this.ownerRepository.findAll(filter);
    return {
      items: result.items.map((owner) => OwnerMapper.toResponse(owner)),
      meta: result.meta,
    };
  }
}
