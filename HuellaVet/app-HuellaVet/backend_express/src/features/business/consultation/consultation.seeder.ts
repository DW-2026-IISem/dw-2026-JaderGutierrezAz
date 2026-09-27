import { faker } from "@faker-js/faker";
import { Consultation } from "./consultation.model";
import { Appointment } from "../appointment/appointment.model";
import { Op } from "sequelize";

/**
 * Seeder del feature Consultation (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere appointments no canceladas. Idempotente: si ya hay filas, no inserta.
 */
export async function seedConsultations(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  consultations: count=0, se omite");
    return 0;
  }

  const existing = await Consultation.count();
  if (existing > 0) {
    console.log(`⏭️  consultations: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const appointments = await Appointment.findAll({ where: { state: { [Op.ne]: "cancelled" } } });
  if (appointments.length === 0) {
    console.log("⏭️  consultations: no hay appointments válidas, se omite seeder");
    return 0;
  }

  const names = ["Consulta general", "Control de vacunas", "Revisión post-cirugía", "Chequeo dermatológico"];

  const rows = Array.from({ length: count }, () => {
    const appointment = appointments[Math.floor(Math.random() * appointments.length)];
    return {
      appointment_id: appointment.id,
      name: faker.helpers.arrayElement(names),
      description: faker.lorem.sentence(),
      is_active: true,
    };
  });

  await Consultation.bulkCreate(rows);
  console.log(`✅ consultations: insertados ${count} registro(s) falsos`);
  return count;
}
