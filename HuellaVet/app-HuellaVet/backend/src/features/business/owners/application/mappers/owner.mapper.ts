import { Owner } from '../../domain/entities/owner.entity.js';
import { OwnerResponseDto } from '../dto/owner-response.dto.js';
import { OwnerModel } from '../../infrastructure/persistence/models/owner.model.js';

export class OwnerMapper {
  static toDomain(model: OwnerModel): Owner {
    return Owner.reconstitute({
      id: model.id,
      documentType: model.documentType,
      documentNumber: model.documentNumber,
      name: model.name,
      phone: model.phone ?? undefined,
      email: model.email ?? undefined,
      isActive: model.isActive,
    });
  }

  static toResponse(entity: Owner): OwnerResponseDto {
    return {
      id: entity.id!,
      documentType: entity.documentType,
      documentNumber: entity.documentNumber,
      name: entity.name,
      phone: entity.phone,
      email: entity.email,
      isActive: entity.isActive,
    };
  }

  static toPersistence(entity: Owner): Partial<OwnerModel> {
    return {
      id: entity.id,
      documentType: entity.documentType,
      documentNumber: entity.documentNumber,
      name: entity.name,
      phone: entity.phone ?? null,
      email: entity.email ?? null,
      isActive: entity.isActive ?? true,
    };
  }
}
