import {
  CreateVaccineApplicationDto,
  UpdateVaccineApplicationDto,
  PatchVaccineApplicationDto,
  VaccineApplicationResponseDto,
  toVaccineApplicationResponse,
} from "./dto";
import { VaccineApplicationRepository } from "./vaccine-application.repository";
import { VaccineApplication } from "./vaccine-application.model";
import { Consultation } from "../consultation/consultation.model";
import { VaccineBatch } from "../vaccine-batch/vaccine-batch.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature VaccineApplication.
 * Reglas de negocio: consultation_id y vaccine_batch_id deben existir y estar
 * activos; política de borrado lógico. No conoce `req`/`res` ni escribe
 * Sequelize directamente.
 */
export class VaccineApplicationService {
  public constructor(
    private readonly repository: VaccineApplicationRepository = new VaccineApplicationRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<VaccineApplicationResponseDto[]> {
    const applications = await this.repository.findAllActive();
    return applications.map((application) => toVaccineApplicationResponse(application));
  }

  public async getOne(id: number): Promise<VaccineApplicationResponseDto> {
    return toVaccineApplicationResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateVaccineApplicationDto): Promise<VaccineApplicationResponseDto> {
    await this.assertActiveConsultation(body.consultation_id);
    await this.assertActiveVaccineBatch(body.vaccine_batch_id);

    const application = await this.repository.create({
      consultation_id: body.consultation_id,
      vaccine_batch_id: body.vaccine_batch_id,
      name: body.name,
      description: body.description ?? null,
      is_active: body.is_active ?? true,
    });
    return toVaccineApplicationResponse(application);
  }

  // ================== UPDATE ==================
  public async updatePut(
    id: number,
    body: UpdateVaccineApplicationDto
  ): Promise<VaccineApplicationResponseDto> {
    const application = await this.findOrFail(id);
    await this.assertActiveConsultation(body.consultation_id);
    await this.assertActiveVaccineBatch(body.vaccine_batch_id);

    await this.repository.update(application, {
      consultation_id: body.consultation_id,
      vaccine_batch_id: body.vaccine_batch_id,
      name: body.name,
      description: body.description ?? null,
    });
    return toVaccineApplicationResponse(application);
  }

  public async updatePatch(
    id: number,
    body: PatchVaccineApplicationDto
  ): Promise<VaccineApplicationResponseDto> {
    const application = await this.findOrFail(id);

    if (body.consultation_id !== undefined) {
      await this.assertActiveConsultation(body.consultation_id);
    }
    if (body.vaccine_batch_id !== undefined) {
      await this.assertActiveVaccineBatch(body.vaccine_batch_id);
    }

    await this.repository.update(application, body);
    return toVaccineApplicationResponse(application);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const application = await this.findOrFail(id, false);
    await this.repository.delete(application);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<VaccineApplicationResponseDto> {
    const application = await this.findOrFail(id);
    await this.repository.update(application, { is_active: false });
    return toVaccineApplicationResponse(application);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<VaccineApplication> {
    const application = await this.repository.findById(id);
    if (!application || (onlyActive && !application.is_active)) {
      throw new AppError(404, "Vaccine application not found");
    }
    return application;
  }

  private async assertActiveConsultation(consultation_id: number): Promise<void> {
    const consultation = await Consultation.findByPk(consultation_id);
    if (!consultation) {
      throw new AppError(404, "Consultation not found");
    }
    if (!consultation.is_active) {
      throw new AppError(400, "Consultation must be active");
    }
  }

  private async assertActiveVaccineBatch(vaccine_batch_id: number): Promise<void> {
    const batch = await VaccineBatch.findByPk(vaccine_batch_id);
    if (!batch) {
      throw new AppError(404, "Vaccine batch not found");
    }
    if (!batch.is_active) {
      throw new AppError(400, "Vaccine batch must be active");
    }
  }
}
