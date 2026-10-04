import { CreationAttributes, Op, Transaction } from "sequelize";
import { RefreshToken } from "./refresh-token.model";

/**
 * Capa Repository del feature RefreshTokens. Única que habla con Sequelize.
 * Las consultas de rotación aceptan transacción y, con lock=true, bloquean la
 * fila (FOR UPDATE) para que dos refreshes simultáneos no ganen los dos.
 */
export class RefreshTokensRepository {
  public async findByHash(
    tokenHash: string,
    transaction?: Transaction,
    lock = false
  ): Promise<RefreshToken | null> {
    return RefreshToken.findOne({
      where: { token_hash: tokenHash },
      transaction,
      ...(lock ? { lock: transaction?.LOCK.UPDATE } : {}),
    });
  }

  public async findAllByUser(userId: number, onlyActive = true): Promise<RefreshToken[]> {
    const where: Record<string, unknown> = { user_id: userId };
    if (onlyActive) where.status = "active";
    return RefreshToken.findAll({ where, order: [["createdAt", "DESC"]] });
  }

  public async findById(id: number): Promise<RefreshToken | null> {
    return RefreshToken.findByPk(id);
  }

  public async create(
    data: CreationAttributes<RefreshToken>,
    transaction?: Transaction
  ): Promise<RefreshToken> {
    return RefreshToken.create(data, { transaction });
  }

  public async update(
    token: RefreshToken,
    data: Partial<RefreshToken>,
    transaction?: Transaction
  ): Promise<RefreshToken> {
    return token.update(data, { transaction });
  }

  /** Revoca toda la familia (reuse detection: robo de un token ya rotado). */
  public async revokeFamily(familyId: string, transaction?: Transaction): Promise<number> {
    const [updated] = await RefreshToken.update(
      { status: "inactive" },
      { where: { family_id: familyId, status: "active" }, transaction }
    );
    return updated;
  }

  public async revokeAllByUser(userId: number): Promise<number> {
    const [updated] = await RefreshToken.update(
      { status: "inactive" },
      { where: { user_id: userId, status: "active" } }
    );
    return updated;
  }

  public async purgeInactiveByUser(userId: number): Promise<number> {
    return RefreshToken.destroy({
      where: {
        user_id: userId,
        [Op.or]: [{ status: "inactive" }, { expires_at: { [Op.lt]: new Date() } }],
      },
    });
  }

  public async countActiveByUser(userId: number): Promise<number> {
    return RefreshToken.count({ where: { user_id: userId, status: "active" } });
  }
}
