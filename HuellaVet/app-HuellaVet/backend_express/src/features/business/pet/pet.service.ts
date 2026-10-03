import {
  CreatePetDto,
  UpdatePetDto,
  PatchPetDto,
  PetResponseDto,
  toPetResponse,
} from "./dto";
import { PetRepository } from "./pet.repository";
import { Pet } from "./pet.model";
import { Owner } from "../owner/owner.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Pet.
 * Reglas de negocio: owner_id debe existir y estar activo; política de
 * borrado lógico. No conoce `req`/`res` ni escribe Sequelize directamente.
 */
export class PetService {
  public constructor(
    private readonly repository: PetRepository = new PetRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<PetResponseDto[]> {
    const pets = await this.repository.findAllActive();
    return pets.map((pet) => toPetResponse(pet));
  }

  public async getOne(id: number): Promise<PetResponseDto> {
    return toPetResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreatePetDto): Promise<PetResponseDto> {
    await this.assertActiveOwner(body.owner_id);

    const pet = await this.repository.create({
      owner_id: body.owner_id,
      name: body.name,
      description: body.description ?? null,
      is_active: body.is_active ?? true,
    });
    return toPetResponse(pet);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdatePetDto): Promise<PetResponseDto> {
    const pet = await this.findOrFail(id);
    await this.assertActiveOwner(body.owner_id);

    await this.repository.update(pet, {
      owner_id: body.owner_id,
      name: body.name,
      description: body.description ?? null,
    });
    return toPetResponse(pet);
  }

  public async updatePatch(id: number, body: PatchPetDto): Promise<PetResponseDto> {
    const pet = await this.findOrFail(id);

    if (body.owner_id !== undefined) {
      await this.assertActiveOwner(body.owner_id);
    }

    await this.repository.update(pet, body);
    return toPetResponse(pet);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const pet = await this.findOrFail(id, false);
    await this.repository.delete(pet);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<PetResponseDto> {
    const pet = await this.findOrFail(id);
    await this.repository.update(pet, { is_active: false });
    return toPetResponse(pet);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<Pet> {
    const pet = await this.repository.findById(id);
    if (!pet || (onlyActive && !pet.is_active)) {
      throw new AppError(404, "Pet not found");
    }
    return pet;
  }

  private async assertActiveOwner(owner_id: number): Promise<void> {
    const owner = await Owner.findByPk(owner_id);
    if (!owner) {
      throw new AppError(404, "Owner not found");
    }
    if (!owner.is_active) {
      throw new AppError(400, "Owner must be active");
    }
  }
}
