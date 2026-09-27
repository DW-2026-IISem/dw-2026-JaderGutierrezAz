import { faker } from "@faker-js/faker";
import { Pet } from "./pet.model";
import { Owner } from "../owner/owner.model";

/**
 * Seeder del feature Pet (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere owners activos. Idempotente: si ya hay filas, no inserta.
 */
export async function seedPets(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  pets: count=0, se omite");
    return 0;
  }

  const existing = await Pet.count();
  if (existing > 0) {
    console.log(`⏭️  pets: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const owners = await Owner.findAll({ where: { is_active: true } });
  if (owners.length === 0) {
    console.log("⏭️  pets: no hay owners activos, se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => {
    const owner = owners[Math.floor(Math.random() * owners.length)];
    return {
      owner_id: owner.id,
      name: faker.animal.dog(),
      description: faker.lorem.sentence(),
      is_active: true,
    };
  });

  await Pet.bulkCreate(rows);
  console.log(`✅ pets: insertados ${count} registro(s) falsos`);
  return count;
}
