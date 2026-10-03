import {
  CreateVeterinarianDto,
  UpdateVeterinarianDto,
  PatchVeterinarianDto,
  VeterinarianResponseDto,
  toVeterinarianResponse,
} from "./dto";
import { VeterinarianRepository } from "./veterinarian.repository";
import { Veterinarian } from "./veterinarian.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Veterinarian.
 * Sin FK que validar; la única regla es la política de borrado lógico.
 * No conoce `req`/`res` ni escribe Sequelize directamente.
 */
export class VeterinarianService {
  public constructor(
    private readonly repository: VeterinarianRepository = new VeterinarianRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<VeterinarianResponseDto[]> {
    const veterinarians = await this.repository.findAllActive();
    return veterinarians.map((veterinarian) => toVeterinarianResponse(veterinarian));
  }

  public async getOne(id: number): Promise<VeterinarianResponseDto> {
    return toVeterinarianResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateVeterinarianDto): Promise<VeterinarianResponseDto> {
    const veterinarian = await this.repository.create({
      name: body.name,
      description: body.description ?? null,
      is_active: body.is_active ?? true,
    });
    return toVeterinarianResponse(veterinarian);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateVeterinarianDto): Promise<VeterinarianResponseDto> {
    const veterinarian = await this.findOrFail(id);

    await this.repository.update(veterinarian, {
      name: body.name,
      description: body.description ?? null,
    });
    return toVeterinarianResponse(veterinarian);
  }

  public async updatePatch(id: number, body: PatchVeterinarianDto): Promise<VeterinarianResponseDto> {
    const veterinarian = await this.findOrFail(id);
    await this.repository.update(veterinarian, body);
    return toVeterinarianResponse(veterinarian);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const veterinarian = await this.findOrFail(id, false);
    await this.repository.delete(veterinarian);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<VeterinarianResponseDto> {
    const veterinarian = await this.findOrFail(id);
    await this.repository.update(veterinarian, { is_active: false });
    return toVeterinarianResponse(veterinarian);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<Veterinarian> {
    const veterinarian = await this.repository.findById(id);
    if (!veterinarian || (onlyActive && !veterinarian.is_active)) {
      throw new AppError(404, "Veterinarian not found");
    }
    return veterinarian;
  }
}
