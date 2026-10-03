import {
  CreateVaccineBatchDto,
  UpdateVaccineBatchDto,
  PatchVaccineBatchDto,
  VaccineBatchResponseDto,
  toVaccineBatchResponse,
} from "./dto";
import { VaccineBatchRepository } from "./vaccine-batch.repository";
import { VaccineBatch } from "./vaccine-batch.model";
import { Vaccine } from "../vaccine/vaccine.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature VaccineBatch.
 * Reglas de negocio: vaccine_id debe existir y estar activa; política de
 * borrado lógico. No conoce `req`/`res` ni escribe Sequelize directamente.
 */
export class VaccineBatchService {
  public constructor(
    private readonly repository: VaccineBatchRepository = new VaccineBatchRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<VaccineBatchResponseDto[]> {
    const batches = await this.repository.findAllActive();
    return batches.map((batch) => toVaccineBatchResponse(batch));
  }

  public async getOne(id: number): Promise<VaccineBatchResponseDto> {
    return toVaccineBatchResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateVaccineBatchDto): Promise<VaccineBatchResponseDto> {
    await this.assertActiveVaccine(body.vaccine_id);

    const batch = await this.repository.create({
      vaccine_id: body.vaccine_id,
      name: body.name,
      description: body.description ?? null,
      is_active: body.is_active ?? true,
    });
    return toVaccineBatchResponse(batch);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateVaccineBatchDto): Promise<VaccineBatchResponseDto> {
    const batch = await this.findOrFail(id);
    await this.assertActiveVaccine(body.vaccine_id);

    await this.repository.update(batch, {
      vaccine_id: body.vaccine_id,
      name: body.name,
      description: body.description ?? null,
    });
    return toVaccineBatchResponse(batch);
  }

  public async updatePatch(id: number, body: PatchVaccineBatchDto): Promise<VaccineBatchResponseDto> {
    const batch = await this.findOrFail(id);

    if (body.vaccine_id !== undefined) {
      await this.assertActiveVaccine(body.vaccine_id);
    }

    await this.repository.update(batch, body);
    return toVaccineBatchResponse(batch);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const batch = await this.findOrFail(id, false);
    await this.repository.delete(batch);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<VaccineBatchResponseDto> {
    const batch = await this.findOrFail(id);
    await this.repository.update(batch, { is_active: false });
    return toVaccineBatchResponse(batch);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<VaccineBatch> {
    const batch = await this.repository.findById(id);
    if (!batch || (onlyActive && !batch.is_active)) {
      throw new AppError(404, "Vaccine batch not found");
    }
    return batch;
  }

  private async assertActiveVaccine(vaccine_id: number): Promise<void> {
    const vaccine = await Vaccine.findByPk(vaccine_id);
    if (!vaccine) {
      throw new AppError(404, "Vaccine not found");
    }
    if (!vaccine.is_active) {
      throw new AppError(400, "Vaccine must be active");
    }
  }
}
