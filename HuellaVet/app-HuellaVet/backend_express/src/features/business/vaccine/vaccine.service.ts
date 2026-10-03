import {
  CreateVaccineDto,
  UpdateVaccineDto,
  PatchVaccineDto,
  VaccineResponseDto,
  toVaccineResponse,
} from "./dto";
import { VaccineRepository } from "./vaccine.repository";
import { Vaccine } from "./vaccine.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Vaccine.
 * Sin FK que validar; la única regla es la política de borrado lógico.
 * No conoce `req`/`res` ni escribe Sequelize directamente.
 */
export class VaccineService {
  public constructor(
    private readonly repository: VaccineRepository = new VaccineRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<VaccineResponseDto[]> {
    const vaccines = await this.repository.findAllActive();
    return vaccines.map((vaccine) => toVaccineResponse(vaccine));
  }

  public async getOne(id: number): Promise<VaccineResponseDto> {
    return toVaccineResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateVaccineDto): Promise<VaccineResponseDto> {
    const vaccine = await this.repository.create({
      name: body.name,
      description: body.description ?? null,
      is_active: body.is_active ?? true,
    });
    return toVaccineResponse(vaccine);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateVaccineDto): Promise<VaccineResponseDto> {
    const vaccine = await this.findOrFail(id);

    await this.repository.update(vaccine, {
      name: body.name,
      description: body.description ?? null,
    });
    return toVaccineResponse(vaccine);
  }

  public async updatePatch(id: number, body: PatchVaccineDto): Promise<VaccineResponseDto> {
    const vaccine = await this.findOrFail(id);
    await this.repository.update(vaccine, body);
    return toVaccineResponse(vaccine);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const vaccine = await this.findOrFail(id, false);
    await this.repository.delete(vaccine);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<VaccineResponseDto> {
    const vaccine = await this.findOrFail(id);
    await this.repository.update(vaccine, { is_active: false });
    return toVaccineResponse(vaccine);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<Vaccine> {
    const vaccine = await this.repository.findById(id);
    if (!vaccine || (onlyActive && !vaccine.is_active)) {
      throw new AppError(404, "Vaccine not found");
    }
    return vaccine;
  }
}
