import { CreationAttributes } from "sequelize";
import { VaccineBatch } from "./vaccine-batch.model";

/**
 * Capa Repository del feature VaccineBatch.
 * Única que habla con Sequelize. No contiene reglas de negocio.
 */
export class VaccineBatchRepository {
  public async findAllActive(): Promise<VaccineBatch[]> {
    return VaccineBatch.findAll({ where: { is_active: true } });
  }

  public async findById(id: number): Promise<VaccineBatch | null> {
    return VaccineBatch.findByPk(id);
  }

  public async create(data: CreationAttributes<VaccineBatch>): Promise<VaccineBatch> {
    return VaccineBatch.create(data);
  }

  public async update(vaccineBatch: VaccineBatch, data: Partial<VaccineBatch>): Promise<VaccineBatch> {
    return vaccineBatch.update(data);
  }

  public async delete(vaccineBatch: VaccineBatch): Promise<void> {
    await vaccineBatch.destroy();
  }
}
