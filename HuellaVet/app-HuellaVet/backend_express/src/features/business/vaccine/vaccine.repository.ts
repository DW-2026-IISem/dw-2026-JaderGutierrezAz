import { CreationAttributes } from "sequelize";
import { Vaccine } from "./vaccine.model";

/**
 * Capa Repository del feature Vaccine.
 * Única que habla con Sequelize. No contiene reglas de negocio.
 */
export class VaccineRepository {
  public async findAllActive(): Promise<Vaccine[]> {
    return Vaccine.findAll({ where: { is_active: true } });
  }

  public async findById(id: number): Promise<Vaccine | null> {
    return Vaccine.findByPk(id);
  }

  public async create(data: CreationAttributes<Vaccine>): Promise<Vaccine> {
    return Vaccine.create(data);
  }

  public async update(vaccine: Vaccine, data: Partial<Vaccine>): Promise<Vaccine> {
    return vaccine.update(data);
  }

  public async delete(vaccine: Vaccine): Promise<void> {
    await vaccine.destroy();
  }
}
