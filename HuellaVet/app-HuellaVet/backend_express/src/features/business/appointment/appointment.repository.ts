import { CreationAttributes, Op } from "sequelize";
import { Appointment } from "./appointment.model";

/**
 * Capa Repository del feature Appointment.
 * Única que habla con Sequelize. No contiene reglas de negocio.
 */
export class AppointmentRepository {
  public async findAllNotCancelled(): Promise<Appointment[]> {
    return Appointment.findAll({ where: { state: { [Op.ne]: "cancelled" } } });
  }

  public async findById(id: number): Promise<Appointment | null> {
    return Appointment.findByPk(id);
  }

  public async create(data: CreationAttributes<Appointment>): Promise<Appointment> {
    return Appointment.create(data);
  }

  public async update(appointment: Appointment, data: Partial<Appointment>): Promise<Appointment> {
    return appointment.update(data);
  }

  public async delete(appointment: Appointment): Promise<void> {
    await appointment.destroy();
  }
}
