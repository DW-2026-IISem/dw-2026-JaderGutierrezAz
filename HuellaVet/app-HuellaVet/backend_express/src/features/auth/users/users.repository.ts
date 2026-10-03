import { CreationAttributes, Op } from "sequelize";
import { User } from "./user.model";

/**
 * Capa Repository del feature Users. Única que habla con Sequelize.
 * Las lecturas normales excluyen password; solo dos métodos con nombre
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

  public async findById(id: number): Promise<User | null> {
    return User.findByPk(id, { attributes: UsersRepository.WITHOUT_PASSWORD });
  }

  /** Un usuario por PK CON su hash. Uso exclusivo: cambio de contraseña. */
  public async findByIdWithPassword(id: number): Promise<User | null> {
    return User.findByPk(id);
  }

  /** Busca por username o email (sin password) para detectar duplicados. */
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
