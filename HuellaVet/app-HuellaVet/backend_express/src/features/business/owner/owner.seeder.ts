import { faker } from "@faker-js/faker";
import { Owner } from "./owner.model";

/**
 * Seeder del feature Owner (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
export async function seedOwners(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  owners: count=0, se omite");
    return 0;
  }

  const existing = await Owner.count();
  if (existing > 0) {
    console.log(`⏭️  owners: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = Array.from({ length: count }, (_, i) => ({
    document_type: faker.helpers.arrayElement(["CC", "CE", "TI"]),
    document_number: faker.string.numeric(10),
    name: faker.person.fullName(),
    phone: faker.phone.number({ style: "national" }),
    email: `owner.${i}.${faker.string.alphanumeric(6)}@example.com`.toLowerCase(),
    is_active: true,
  }));

  await Owner.bulkCreate(rows);
  console.log(`✅ owners: insertados ${count} registro(s) falsos`);
  return count;
}
