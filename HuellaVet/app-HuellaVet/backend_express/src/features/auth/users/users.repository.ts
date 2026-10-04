import { CreationAttributes, Op, Transaction } from "sequelize";
import { User } from "./user.model";

/**
 * Capa Repository del feature Users. Única que habla con Sequelize.
 * Las lecturas normales excluyen password; solo tres métodos con nombre
 * explícito (...WithPassword) lo incluyen.
 */
export class UsersRepository {
  private static readonly WITHOUT_PASSWORD = { exclude: ["password"] };

  public async findAllActive(): Promise<User[]> {
    return User.findAll({
      where: { status: "active" },
      attributes: UsersRepository.WITHOUT_PASSWORD,
    });
  }

  public async findById(id: number, transaction?: Transaction): Promise<User | null> {
    return User.findByPk(id, { attributes: UsersRepository.WITHOUT_PASSWORD, transaction });
  }

  /** Un usuario por PK CON su hash. Uso exclusivo: cambio de contraseña. */
  public async findByIdWithPassword(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  /**
   * Un usuario por username o email, CON su hash.
   * Uso exclusivo: validación de credenciales en el login (única operación
   * que lee la credencial). Normaliza a minúsculas para casar con lo guardado.
   */
  public async findByIdentifierWithPassword(identifier: string): Promise<User | null> {
    const value = identifier.trim().toLowerCase();
    return User.findOne({ where: { [Op.or]: [{ username: value }, { email: value }] } });
  }

  public async findConflicts(username: string, email: string): Promise<User[]> {
    return User.findAll({
      where: {
        [Op.or]: [
          { username: username.trim().toLowerCase() },
          { email: email.trim().toLowerCase() },
        ],
      },
      attributes: ["id", "username", "email"],
    });
  }

  public async create(data: CreationAttributes<User>): Promise<User> {
    return User.create(data);
  }

  public async update(user: User, data: Partial<User>): Promise<User> {
    return user.update(data);
  }

  public async delete(user: User): Promise<void> {
    await user.destroy();
  }
}
