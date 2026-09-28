import { faker } from "@faker-js/faker";
import { VaccineBatch } from "./vaccine-batch.model";
import { Vaccine } from "../vaccine/vaccine.model";

/**
 * Seeder del feature VaccineBatch (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere vaccines activas. Idempotente: si ya hay filas, no inserta.
 */
export async function seedVaccineBatches(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  vaccine_batches: count=0, se omite");
    return 0;
  }

  const existing = await VaccineBatch.count();
  if (existing > 0) {
    console.log(`⏭️  vaccine_batches: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const vaccines = await Vaccine.findAll({ where: { is_active: true } });
  if (vaccines.length === 0) {
    console.log("⏭️  vaccine_batches: no hay vaccines activas, se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => {
    const vaccine = vaccines[Math.floor(Math.random() * vaccines.length)];
    return {
      vaccine_id: vaccine.id,
      name: `Lote ${faker.string.alphanumeric(8).toUpperCase()}`,
      description: faker.lorem.sentence(),
      is_active: true,
    };
  });

  await VaccineBatch.bulkCreate(rows);
  console.log(`✅ vaccine_batches: insertados ${count} registro(s) falsos`);
  return count;
}
