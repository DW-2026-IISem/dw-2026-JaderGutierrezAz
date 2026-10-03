import {
  CreateOwnerDto,
  UpdateOwnerDto,
  PatchOwnerDto,
  OwnerResponseDto,
  toOwnerResponse,
} from "./dto";
import { OwnerRepository } from "./owner.repository";
import { Owner } from "./owner.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Owner.
 * Reglas de negocio: unicidad de `document_number` y política de borrado lógico.
 * No conoce `req`/`res` ni escribe Sequelize directamente.
 */
export class OwnerService {
  public constructor(
    private readonly repository: OwnerRepository = new OwnerRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<OwnerResponseDto[]> {
    const owners = await this.repository.findAllActive();
    return owners.map((owner) => toOwnerResponse(owner));
  }

  public async getOne(id: number): Promise<OwnerResponseDto> {
    return toOwnerResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateOwnerDto): Promise<OwnerResponseDto> {
    await this.assertDocumentAvailable(body.document_number);

    const owner = await this.repository.create({
      document_type: body.document_type,
      document_number: body.document_number,
      name: body.name,
      phone: body.phone ?? null,
      email: body.email ?? null,
      is_active: body.is_active ?? true,
    });
    return toOwnerResponse(owner);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateOwnerDto): Promise<OwnerResponseDto> {
    const owner = await this.findOrFail(id);
    await this.assertDocumentAvailable(body.document_number, id);

    await this.repository.update(owner, {
      document_type: body.document_type,
      document_number: body.document_number,
      name: body.name,
      phone: body.phone ?? null,
      email: body.email ?? null,
    });
    return toOwnerResponse(owner);
  }

  public async updatePatch(id: number, body: PatchOwnerDto): Promise<OwnerResponseDto> {
    const owner = await this.findOrFail(id);

    if (body.document_number) {
      await this.assertDocumentAvailable(body.document_number, id);
    }

    await this.repository.update(owner, body);
    return toOwnerResponse(owner);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const owner = await this.findOrFail(id, false);
    await this.repository.delete(owner);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<OwnerResponseDto> {
    const owner = await this.findOrFail(id);
    await this.repository.update(owner, { is_active: false });
    return toOwnerResponse(owner);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<Owner> {
    const owner = await this.repository.findById(id);
    if (!owner || (onlyActive && !owner.is_active)) {
      throw new AppError(404, "Owner not found");
    }
    return owner;
  }

  /** 409 si otro propietario ya usa ese `document_number`. */
  private async assertDocumentAvailable(document_number: string, excludeId?: number): Promise<void> {
    const conflicts = await this.repository.findConflicts(document_number);
    const taken = conflicts.find((candidate) => candidate.id !== excludeId);
    if (taken) {
      throw new AppError(409, "document_number already in use");
    }
  }
}
