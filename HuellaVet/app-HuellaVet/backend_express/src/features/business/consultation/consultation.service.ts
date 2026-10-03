import {
  CreateConsultationDto,
  UpdateConsultationDto,
  PatchConsultationDto,
  ConsultationResponseDto,
  toConsultationResponse,
} from "./dto";
import { ConsultationRepository } from "./consultation.repository";
import { Consultation } from "./consultation.model";
import { Appointment } from "../appointment/appointment.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Consultation.
 * Reglas de negocio: appointment_id debe existir y no estar cancelada;
 * política de borrado lógico. No conoce `req`/`res` ni escribe Sequelize
 * directamente.
 */
export class ConsultationService {
  public constructor(
    private readonly repository: ConsultationRepository = new ConsultationRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<ConsultationResponseDto[]> {
    const consultations = await this.repository.findAllActive();
    return consultations.map((consultation) => toConsultationResponse(consultation));
  }

  public async getOne(id: number): Promise<ConsultationResponseDto> {
    return toConsultationResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateConsultationDto): Promise<ConsultationResponseDto> {
    await this.assertValidAppointment(body.appointment_id);

    const consultation = await this.repository.create({
      appointment_id: body.appointment_id,
      name: body.name,
      description: body.description ?? null,
      is_active: body.is_active ?? true,
    });
    return toConsultationResponse(consultation);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateConsultationDto): Promise<ConsultationResponseDto> {
    const consultation = await this.findOrFail(id);
    await this.assertValidAppointment(body.appointment_id);

    await this.repository.update(consultation, {
      appointment_id: body.appointment_id,
      name: body.name,
      description: body.description ?? null,
    });
    return toConsultationResponse(consultation);
  }

  public async updatePatch(id: number, body: PatchConsultationDto): Promise<ConsultationResponseDto> {
    const consultation = await this.findOrFail(id);

    if (body.appointment_id !== undefined) {
      await this.assertValidAppointment(body.appointment_id);
    }

    await this.repository.update(consultation, body);
    return toConsultationResponse(consultation);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const consultation = await this.findOrFail(id, false);
    await this.repository.delete(consultation);
  }

  /** Eliminación lógica -> `is_active = false`. */
  public async deleteLogical(id: number): Promise<ConsultationResponseDto> {
    const consultation = await this.findOrFail(id);
    await this.repository.update(consultation, { is_active: false });
    return toConsultationResponse(consultation);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, onlyActive = true): Promise<Consultation> {
    const consultation = await this.repository.findById(id);
    if (!consultation || (onlyActive && !consultation.is_active)) {
      throw new AppError(404, "Consultation not found");
    }
    return consultation;
  }

  private async assertValidAppointment(appointment_id: number): Promise<void> {
    const appointment = await Appointment.findByPk(appointment_id);
    if (!appointment) {
      throw new AppError(404, "Appointment not found");
    }
    if (appointment.state === "cancelled") {
      throw new AppError(400, "Appointment must not be cancelled");
    }
  }
}
