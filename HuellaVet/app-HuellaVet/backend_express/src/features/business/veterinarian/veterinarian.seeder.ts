import { faker } from "@faker-js/faker";
import { Veterinarian } from "./veterinarian.model";

/**
 * Seeder del feature Veterinarian (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedVeterinarians(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  veterinarians: count=0, se omite");
    return 0;
  }

  const existing = await Veterinarian.count();
  if (existing > 0) {
    console.log(`⏭️  veterinarians: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, () => ({
    name: `Dr. ${faker.person.fullName()}`,
    description: faker.lorem.sentence(),
    is_active: true,
  }));

  await Veterinarian.bulkCreate(rows);
  console.log(`✅ veterinarians: insertados ${count} registro(s) falsos`);
  return count;
}
