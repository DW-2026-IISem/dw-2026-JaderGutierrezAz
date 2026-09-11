import { Inject, Injectable } from '@nestjs/common';
import { OwnerDocumentAlreadyExistsException } from '../../domain/exceptions/owner-document-already-exists.exception.js';
import { Owner } from '../../domain/entities/owner.entity.js';
import {
  OWNER_REPOSITORY,
  type IOwnerRepository,
} from '../../domain/interfaces/owner-repository.interface.js';
import { CreateOwnerDto } from '../dto/create-owner.dto.js';
import { OwnerMapper } from '../mappers/owner.mapper.js';

@Injectable()
export class CreateOwnerUseCase {
  constructor(
    @Inject(OWNER_REPOSITORY)
    private readonly ownerRepository: IOwnerRepository,
  ) {}

  async execute(dto: CreateOwnerDto) {
    const existing = await this.ownerRepository.findByDocumentNumber(
      dto.documentNumber,
    );
    if (existing) {
      throw new OwnerDocumentAlreadyExistsException(dto.documentNumber);
    }

    const owner = Owner.create({
      documentType: dto.documentType,
      documentNumber: dto.documentNumber,
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
    });

    const created = await this.ownerRepository.create(owner);
    return OwnerMapper.toResponse(created);
  }
}
