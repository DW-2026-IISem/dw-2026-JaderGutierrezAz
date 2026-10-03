import { CreationAttributes, Op } from "sequelize";
import { Pay } from "./pay.model";

/**
 * Capa Repository del feature Pay.
 * Única que habla con Sequelize. No resuelve la referencia polimórfica
 * (eso es responsabilidad del service).
 */
export class PayRepository {
  public async findAllNotCancelled(): Promise<Pay[]> {
    return Pay.findAll({ where: { state: { [Op.ne]: "cancelled" } } });
  }

  public async findById(id: number): Promise<Pay | null> {
    return Pay.findByPk(id);
  }

  public async create(data: CreationAttributes<Pay>): Promise<Pay> {
    return Pay.create(data);
  }

  public async update(pay: Pay, data: Partial<Pay>): Promise<Pay> {
    return pay.update(data);
  }

  public async delete(pay: Pay): Promise<void> {
    await pay.destroy();
  }
}
