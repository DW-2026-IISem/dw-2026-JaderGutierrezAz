import { faker } from "@faker-js/faker";
import { VaccineApplication } from "./vaccine-application.model";
import { Consultation } from "../consultation/consultation.model";
import { VaccineBatch } from "../vaccine-batch/vaccine-batch.model";

/**
 * Seeder del feature VaccineApplication (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere consultations y vaccine_batches activos. Idempotente: si ya hay filas, no inserta.
 */
export async function seedVaccineApplications(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  vaccine_applications: count=0, se omite");
    return 0;
  }

  const existing = await VaccineApplication.count();
  if (existing > 0) {
    console.log(`⏭️  vaccine_applications: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const consultations = await Consultation.findAll({ where: { is_active: true } });
  const batches = await VaccineBatch.findAll({ where: { is_active: true } });

  if (consultations.length === 0 || batches.length === 0) {
    console.log("⏭️  vaccine_applications: no hay consultations/vaccine_batches activos, se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => {
    const consultation = consultations[Math.floor(Math.random() * consultations.length)];
    const batch = batches[Math.floor(Math.random() * batches.length)];
    return {
      consultation_id: consultation.id,
      vaccine_batch_id: batch.id,
      name: `Aplicación ${faker.string.alphanumeric(5).toUpperCase()}`,
      description: faker.lorem.sentence(),
      is_active: true,
    };
  });

  await VaccineApplication.bulkCreate(rows);
  console.log(`✅ vaccine_applications: insertados ${count} registro(s) falsos`);
  return count;
}
