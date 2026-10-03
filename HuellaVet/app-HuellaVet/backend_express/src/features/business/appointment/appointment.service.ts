import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  PatchAppointmentDto,
  AppointmentResponseDto,
  toAppointmentResponse,
} from "./dto";
import { AppointmentRepository } from "./appointment.repository";
import { Appointment } from "./appointment.model";
import { Pet } from "../pet/pet.model";
import { Veterinarian } from "../veterinarian/veterinarian.model";
import { AppError } from "../../../shared/errors/app-error";

/**
 * Capa Service del feature Appointment.
 * Reglas de negocio: pet_id y veterinarian_id deben existir y estar activos;
 * "cancelar" (borrado lógico) y "completar" son transiciones de estado
 * distintas. No conoce `req`/`res` ni escribe Sequelize directamente.
 */
export class AppointmentService {
  public constructor(
    private readonly repository: AppointmentRepository = new AppointmentRepository()
  ) {}

  // ================== READ ==================
  public async getAll(): Promise<AppointmentResponseDto[]> {
    const appointments = await this.repository.findAllNotCancelled();
    return appointments.map((appointment) => toAppointmentResponse(appointment));
  }

  public async getOne(id: number): Promise<AppointmentResponseDto> {
    return toAppointmentResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreateAppointmentDto): Promise<AppointmentResponseDto> {
    await this.assertActivePet(body.pet_id);
    await this.assertActiveVeterinarian(body.veterinarian_id);

    const appointment = await this.repository.create({
      pet_id: body.pet_id,
      veterinarian_id: body.veterinarian_id,
      start_date: body.start_date,
      end_date: body.end_date,
      reason: body.reason,
      state: body.state ?? "scheduled",
    });
    return toAppointmentResponse(appointment);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdateAppointmentDto): Promise<AppointmentResponseDto> {
    const appointment = await this.findOrFail(id);
    await this.assertActivePet(body.pet_id);
    await this.assertActiveVeterinarian(body.veterinarian_id);

    await this.repository.update(appointment, {
      pet_id: body.pet_id,
      veterinarian_id: body.veterinarian_id,
      start_date: body.start_date,
      end_date: body.end_date,
      reason: body.reason,
    });
    return toAppointmentResponse(appointment);
  }

  public async updatePatch(id: number, body: PatchAppointmentDto): Promise<AppointmentResponseDto> {
    const appointment = await this.findOrFail(id);

    if (body.pet_id !== undefined) {
      await this.assertActivePet(body.pet_id);
    }
    if (body.veterinarian_id !== undefined) {
      await this.assertActiveVeterinarian(body.veterinarian_id);
    }

    await this.repository.update(appointment, body);
    return toAppointmentResponse(appointment);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const appointment = await this.findOrFail(id, false);
    await this.repository.delete(appointment);
  }

  /** Eliminación lógica -> `state = cancelled`. */
  public async deleteLogical(id: number): Promise<AppointmentResponseDto> {
    const appointment = await this.findOrFail(id);
    await this.repository.update(appointment, { state: "cancelled" });
    return toAppointmentResponse(appointment);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, requireNotCancelled = true): Promise<Appointment> {
    const appointment = await this.repository.findById(id);
    if (!appointment || (requireNotCancelled && appointment.state === "cancelled")) {
      throw new AppError(404, "Appointment not found");
    }
    return appointment;
  }

  private async assertActivePet(pet_id: number): Promise<void> {
    const pet = await Pet.findByPk(pet_id);
    if (!pet) {
      throw new AppError(404, "Pet not found");
    }
    if (!pet.is_active) {
      throw new AppError(400, "Pet must be active");
    }
  }

  private async assertActiveVeterinarian(veterinarian_id: number): Promise<void> {
    const veterinarian = await Veterinarian.findByPk(veterinarian_id);
    if (!veterinarian) {
      throw new AppError(404, "Veterinarian not found");
    }
    if (!veterinarian.is_active) {
      throw new AppError(400, "Veterinarian must be active");
    }
  }
}
