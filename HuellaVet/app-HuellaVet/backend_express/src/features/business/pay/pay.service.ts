import {
  CreatePayDto,
  UpdatePayDto,
  PatchPayDto,
  PayResponseDto,
  toPayResponse,
} from "./dto";
import { PayRepository } from "./pay.repository";
import { Pay, PayReferenceType } from "./pay.model";
import { Appointment } from "../appointment/appointment.model";
import { AppError } from "../../../shared/errors/app-error";

type ReferenceValidator = (id: number) => Promise<void>;

/**
 * Capa Service del feature Pay.
 *
 * `reference_type` decide en cuál tabla se busca `reference_id` (referencia
 * polimórfica). Hoy solo existe "appointment" en el diagrama; agregar un tipo
 * nuevo solo requiere sumar una entrada en `REFERENCE_VALIDATORS`. No hay FK
 * real de base de datos que lo garantice, así que esta validación en código es
 * la única barrera contra un `reference_type` inventado.
 */
export class PayService {
  private readonly referenceValidators: Record<PayReferenceType, ReferenceValidator> = {
    appointment: async (id) => {
      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        throw new AppError(404, "Referenced appointment not found");
      }
      if (appointment.state === "cancelled") {
        throw new AppError(400, "Referenced appointment is cancelled");
      }
    },
  };

  public constructor(private readonly repository: PayRepository = new PayRepository()) {}

  // ================== READ ==================
  public async getAll(): Promise<PayResponseDto[]> {
    const pays = await this.repository.findAllNotCancelled();
    return pays.map((pay) => toPayResponse(pay));
  }

  public async getOne(id: number): Promise<PayResponseDto> {
    return toPayResponse(await this.findOrFail(id));
  }

  // ================== CREATE ==================
  public async create(body: CreatePayDto): Promise<PayResponseDto> {
    await this.assertValidReference(body.reference_type, body.reference_id);

    const pay = await this.repository.create({
      reference_type: body.reference_type,
      reference_id: body.reference_id,
      method: body.method,
      amount: body.amount,
      date: body.date,
      state: body.state ?? "pending",
    });
    return toPayResponse(pay);
  }

  // ================== UPDATE ==================
  public async updatePut(id: number, body: UpdatePayDto): Promise<PayResponseDto> {
    const pay = await this.findOrFail(id);
    await this.assertValidReference(body.reference_type, body.reference_id);

    await this.repository.update(pay, {
      reference_type: body.reference_type,
      reference_id: body.reference_id,
      method: body.method,
      amount: body.amount,
      date: body.date,
    });
    return toPayResponse(pay);
  }

  public async updatePatch(id: number, body: PatchPayDto): Promise<PayResponseDto> {
    const pay = await this.findOrFail(id);

    if (body.reference_type !== undefined || body.reference_id !== undefined) {
      const referenceType = body.reference_type ?? pay.reference_type;
      const referenceId = body.reference_id ?? pay.reference_id;
      await this.assertValidReference(referenceType, referenceId);
    }

    await this.repository.update(pay, body);
    return toPayResponse(pay);
  }

  // ================== DELETE ==================
  /** Eliminación física. */
  public async deletePhysical(id: number): Promise<void> {
    const pay = await this.findOrFail(id, false);
    await this.repository.delete(pay);
  }

  /** Eliminación lógica -> `state = cancelled`. */
  public async deleteLogical(id: number): Promise<PayResponseDto> {
    const pay = await this.findOrFail(id);
    await this.repository.update(pay, { state: "cancelled" });
    return toPayResponse(pay);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number, requireNotCancelled = true): Promise<Pay> {
    const pay = await this.repository.findById(id);
    if (!pay || (requireNotCancelled && pay.state === "cancelled")) {
      throw new AppError(404, "Pay not found");
    }
    return pay;
  }

  private async assertValidReference(
    reference_type: PayReferenceType,
    reference_id: number
  ): Promise<void> {
    const validator = this.referenceValidators[reference_type];
    if (!validator) {
      throw new AppError(400, `Unsupported reference_type: ${reference_type}`);
    }
    await validator(reference_id);
  }
}
