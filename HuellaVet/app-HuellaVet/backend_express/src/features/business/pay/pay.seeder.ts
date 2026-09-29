import { faker } from "@faker-js/faker";
import { Op } from "sequelize";
import { Pay } from "./pay.model";
import { Appointment } from "../appointment/appointment.model";

/**
 * Seeder del feature Pay (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere appointments no canceladas (único reference_type soportado hoy).
 * Idempotente: si ya hay filas, no inserta.
 */
export async function seedPays(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  pays: count=0, se omite");
    return 0;
  }

  const existing = await Pay.count();
  if (existing > 0) {
    console.log(`⏭️  pays: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const appointments = await Appointment.findAll({ where: { state: { [Op.ne]: "cancelled" } } });
  if (appointments.length === 0) {
    console.log("⏭️  pays: no hay appointments válidas, se omite seeder");
    return 0;
  }

  const methods = ["Efectivo", "Tarjeta de crédito", "Tarjeta débito", "Transferencia"];

  const rows = Array.from({ length: count }, () => {
    const appointment = appointments[Math.floor(Math.random() * appointments.length)];
    return {
      reference_type: "appointment" as const,
      reference_id: appointment.id,
      method: faker.helpers.arrayElement(methods),
      amount: faker.number.float({ min: 30000, max: 250000, fractionDigits: 2 }),
      date: faker.date.recent({ days: 15 }),
      state: "paid" as const,
    };
  });

  await Pay.bulkCreate(rows);
  console.log(`✅ pays: insertados ${count} registro(s) falsos`);
  return count;
}
