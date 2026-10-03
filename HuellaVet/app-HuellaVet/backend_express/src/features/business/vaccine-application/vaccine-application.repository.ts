import { CreationAttributes } from "sequelize";
import { VaccineApplication } from "./vaccine-application.model";

/**
 * Capa Repository del feature VaccineApplication.
 * Única que habla con Sequelize. No contiene reglas de negocio.
 */
export class VaccineApplicationRepository {
  public async findAllActive(): Promise<VaccineApplication[]> {
    return VaccineApplication.findAll({ where: { is_active: true } });
  }

  public async findById(id: number): Promise<VaccineApplication | null> {
    return VaccineApplication.findByPk(id);
  }

  public async create(data: CreationAttributes<VaccineApplication>): Promise<VaccineApplication> {
    return VaccineApplication.create(data);
  }

  public async update(
    vaccineApplication: VaccineApplication,
    data: Partial<VaccineApplication>
  ): Promise<VaccineApplication> {
    return vaccineApplication.update(data);
  }

  public async delete(vaccineApplication: VaccineApplication): Promise<void> {
    await vaccineApplication.destroy();
  }
}
