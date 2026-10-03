import { CreationAttributes } from "sequelize";
import { Consultation } from "./consultation.model";

/**
 * Capa Repository del feature Consultation.
 * Única que habla con Sequelize. No contiene reglas de negocio.
 */
export class ConsultationRepository {
  public async findAllActive(): Promise<Consultation[]> {
    return Consultation.findAll({ where: { is_active: true } });
  }

  public async findById(id: number): Promise<Consultation | null> {
    return Consultation.findByPk(id);
  }

  public async create(data: CreationAttributes<Consultation>): Promise<Consultation> {
    return Consultation.create(data);
  }

  public async update(consultation: Consultation, data: Partial<Consultation>): Promise<Consultation> {
    return consultation.update(data);
  }

  public async delete(consultation: Consultation): Promise<void> {
    await consultation.destroy();
  }
}
