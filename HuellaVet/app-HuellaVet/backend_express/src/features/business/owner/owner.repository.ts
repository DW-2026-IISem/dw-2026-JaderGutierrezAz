import { CreationAttributes } from "sequelize";
import { Owner } from "./owner.model";

/**
 * Capa Repository del feature Owner.
 * Única que habla con Sequelize. No contiene reglas de negocio.
 */
export class OwnerRepository {
  public async findAllActive(): Promise<Owner[]> {
    return Owner.findAll({ where: { is_active: true } });
  }

  public async findById(id: number): Promise<Owner | null> {
    return Owner.findByPk(id);
  }

  /** Busca por `document_number` para detectar duplicados. */
  public async findConflicts(document_number: string): Promise<Owner[]> {
    return Owner.findAll({
      where: { document_number },
      attributes: ["id", "document_number"],
    });
  }

  public async create(data: CreationAttributes<Owner>): Promise<Owner> {
    return Owner.create(data);
  }

  public async update(owner: Owner, data: Partial<Owner>): Promise<Owner> {
    return owner.update(data);
  }

  public async delete(owner: Owner): Promise<void> {
    await owner.destroy();
  }
}
