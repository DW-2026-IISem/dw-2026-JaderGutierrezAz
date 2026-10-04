import { Transaction } from "sequelize";
import { randomUUID } from "node:crypto";
import { RefreshTokenResponseDto, toRefreshTokenResponse } from "./dto";
import { RefreshTokensRepository } from "./refresh-tokens.repository";
import { RefreshToken } from "./refresh-token.model";
import { AppError } from "../../../shared/errors/app-error";
import { generateOpaqueToken, sha256Hex } from "../../../shared/auth/password";
import { withTransaction } from "../../../shared/database/with-transaction";

const REFRESH_TTL_DAYS = Number(process.env.JWT_REFRESH_TTL_DAYS ?? 7);

export interface IssuedSession {
  rawToken: string;
  familyId: string;
  expiresAt: Date;
}

/**
 * Unión discriminada: no se lanza dentro de la transacción de rotate() porque
 * un throw haría rollback de la revocación de familia que acabamos de escribir.
 */
export type RotationOutcome =
  | { kind: "rotated"; userId: number; rawToken: string; familyId: string; expiresAt: Date }
  | { kind: "invalid" }
  | { kind: "expired" }
  | { kind: "reuse"; familyId: string; revoked: number };

/**
 * Capa Service del feature RefreshTokens.
 * Dos responsabilidades: gestión de sesiones propias (modalidad JWT, sin
 * RBAC) y el ciclo de vida del token (emitir/rotar/revocar), consumido por
 * el feature Session en ISS-15.
 */
export class RefreshTokensService {
  public constructor(
    private readonly repository: RefreshTokensRepository = new RefreshTokensRepository()
  ) {}

  // ================== GESTIÓN (sesiones propias) ==================
  public async getAllMine(userId: number): Promise<RefreshTokenResponseDto[]> {
    const tokens = await this.repository.findAllByUser(userId);
    return tokens.map((token) => toRefreshTokenResponse(token));
  }

  public async getMine(userId: number, id: number): Promise<RefreshTokenResponseDto> {
    return toRefreshTokenResponse(await this.findMineOrFail(userId, id));
  }

  public async revokeMine(userId: number, id: number): Promise<RefreshTokenResponseDto> {
    const token = await this.findMineOrFail(userId, id);
    await this.repository.update(token, { status: "inactive" });
    return toRefreshTokenResponse(token);
  }

  public async revokeAllMine(userId: number): Promise<number> {
    return this.repository.revokeAllByUser(userId);
  }

  public async purgeMine(userId: number): Promise<number> {
    return this.repository.purgeInactiveByUser(userId);
  }

  public async countActiveMine(userId: number): Promise<number> {
    return this.repository.countActiveByUser(userId);
  }

  // ================== CICLO DE VIDA ==================
  /** Emite una sesión nueva (alta de login). Genera un family_id nuevo. */
  public async issue(
    userId: number,
    deviceInfo: string | null,
    transaction?: Transaction
  ): Promise<IssuedSession> {
    const rawToken = generateOpaqueToken();
    const familyId = randomUUID();
    const expiresAt = expiryFromNow();

    await this.repository.create(
      {
        user_id: userId,
        token_hash: sha256Hex(rawToken),
        family_id: familyId,
        device_info: deviceInfo,
        expires_at: expiresAt,
        status: "active",
      },
      transaction
    );

    return { rawToken, familyId, expiresAt };
  }

  /** Rota un refresh token: lo invalida y emite uno nuevo con el mismo family_id. */
  public async rotate(rawToken: string, deviceInfo: string | null): Promise<RotationOutcome> {
    const hash = sha256Hex(rawToken);

    return withTransaction<RotationOutcome>(async (t) => {
      const current = await this.repository.findByHash(hash, t, true);

      if (!current) {
        return { kind: "invalid" };
      }

      // REUSE DETECTION: el token existía pero ya no está activo (fue rotado).
      if (current.status !== "active") {
        const revoked = await this.repository.revokeFamily(current.family_id, t);
        return { kind: "reuse", familyId: current.family_id, revoked };
      }

      if (new Date(current.expires_at).getTime() <= Date.now()) {
        await this.repository.update(current, { status: "inactive" }, t);
        return { kind: "expired" };
      }

      await this.repository.update(current, { status: "inactive" }, t);

      const rawNext = generateOpaqueToken();
      const expiresAt = expiryFromNow();
      await this.repository.create(
        {
          user_id: current.user_id,
          token_hash: sha256Hex(rawNext),
          family_id: current.family_id,
          device_info: deviceInfo ?? current.device_info,
          expires_at: expiresAt,
          status: "active",
        },
        t
      );

      return {
        kind: "rotated",
        userId: current.user_id,
        rawToken: rawNext,
        familyId: current.family_id,
        expiresAt,
      };
    });
  }

  /** Cierra la sesión asociada a un refresh token (logout). Idempotente. */
  public async revokeByToken(rawToken: string): Promise<boolean> {
    const token = await this.repository.findByHash(sha256Hex(rawToken));
    if (!token) return false;
    if (token.status !== "active") return true;

    await this.repository.update(token, { status: "inactive" });
    return true;
  }

  // ================== HELPERS ==================
  private async findMineOrFail(userId: number, id: number): Promise<RefreshToken> {
    const token = await this.repository.findById(id);
    if (!token || token.user_id !== userId) {
      throw new AppError(404, "Session not found");
    }
    return token;
  }
}

function expiryFromNow(): Date {
  return new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000);
}
