import { CreationAttributes } from "sequelize";
import { Veterinarian } from "./veterinarian.model";

/**
 * Capa Repository del feature Veterinarian.
 * Única que habla con Sequelize. No contiene reglas de negocio.
 */
export class VeterinarianRepository {
  public async findAllActive(): Promise<Veterinarian[]> {
    return Veterinarian.findAll({ where: { is_active: true } });
  }

  public async findById(id: number): Promise<Veterinarian | null> {
    return Veterinarian.findByPk(id);
  }

  public async create(data: CreationAttributes<Veterinarian>): Promise<Veterinarian> {
    return Veterinarian.create(data);
  }

  public async update(veterinarian: Veterinarian, data: Partial<Veterinarian>): Promise<Veterinarian> {
    return veterinarian.update(data);
  }

  public async delete(veterinarian: Veterinarian): Promise<void> {
    await veterinarian.destroy();
  }
}
