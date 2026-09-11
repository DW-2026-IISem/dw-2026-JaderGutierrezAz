import { Inject, Injectable } from '@nestjs/common';
import { OwnerNotFoundException } from '../../domain/exceptions/owner-not-found.exception.js';
import {
  OWNER_REPOSITORY,
  type IOwnerRepository,
} from '../../domain/interfaces/owner-repository.interface.js';
import { OwnerMapper } from '../mappers/owner.mapper.js';

@Injectable()
export class GetOwnerUseCase {
  constructor(
    @Inject(OWNER_REPOSITORY)
    private readonly ownerRepository: IOwnerRepository,
  ) {}

  async execute(id: number) {
    const owner = await this.ownerRepository.findById(id);
    if (!owner) {
      throw new OwnerNotFoundException(id);
    }

    return OwnerMapper.toResponse(owner);
  }
}
