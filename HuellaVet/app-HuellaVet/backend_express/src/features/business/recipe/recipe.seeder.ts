import { faker } from "@faker-js/faker";
import { Recipe } from "./recipe.model";
import { Consultation } from "../consultation/consultation.model";

/**
 * Seeder del feature Recipe (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere consultations activas. Idempotente: si ya hay filas, no inserta.
 */
export async function seedRecipes(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  recipes: count=0, se omite");
    return 0;
  }

  const existing = await Recipe.count();
  if (existing > 0) {
    console.log(`⏭️  recipes: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const consultations = await Consultation.findAll({ where: { is_active: true } });
  if (consultations.length === 0) {
    console.log("⏭️  recipes: no hay consultations activas, se omite seeder");
    return 0;
  }

  const names = ["Antiinflamatorio", "Antibiótico", "Desparasitante", "Analgésico", "Suplemento vitamínico"];

  const rows = Array.from({ length: count }, () => {
    const consultation = consultations[Math.floor(Math.random() * consultations.length)];
    return {
      consultation_id: consultation.id,
      name: faker.helpers.arrayElement(names),
      description: faker.lorem.sentence(),
      is_active: true,
    };
  });

  await Recipe.bulkCreate(rows);
  console.log(`✅ recipes: insertados ${count} registro(s) falsos`);
  return count;
}
