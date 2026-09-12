import { Inject, Injectable } from '@nestjs/common';
import { OwnerDocumentAlreadyExistsException } from '../../domain/exceptions/owner-document-already-exists.exception.js';
import { OwnerNotFoundException } from '../../domain/exceptions/owner-not-found.exception.js';
import {
  OWNER_REPOSITORY,
  type IOwnerRepository,
} from '../../domain/interfaces/owner-repository.interface.js';
import { UpdateOwnerDto } from '../dto/update-owner.dto.js';
import { OwnerMapper } from '../mappers/owner.mapper.js';

@Injectable()
export class UpdateOwnerUseCase {
  constructor(
    @Inject(OWNER_REPOSITORY)
    private readonly ownerRepository: IOwnerRepository,
  ) {}

  async execute(id: number, dto: UpdateOwnerDto) {
    const owner = await this.ownerRepository.findById(id);
    if (!owner) {
      throw new OwnerNotFoundException(id);
    }

    if (dto.documentNumber && dto.documentNumber !== owner.documentNumber) {
      const existing = await this.ownerRepository.findByDocumentNumber(
        dto.documentNumber,
      );
      if (existing) {
        throw new OwnerDocumentAlreadyExistsException(dto.documentNumber);
      }
    }

    owner.update(dto);
    const updated = await this.ownerRepository.update(owner);
    return OwnerMapper.toResponse(updated);
  }
}
