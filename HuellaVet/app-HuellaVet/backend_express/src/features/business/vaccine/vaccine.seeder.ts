import { Vaccine } from "./vaccine.model";

/**
 * Seeder del feature Vaccine (catálogo fijo, no datos aleatorios de Faker,
 * porque los nombres de vacunas veterinarias son un catálogo real y acotado).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Idempotente: si ya hay filas, no vuelve a insertar.
 */
const CATALOG = [
  { name: "Antirrábica", description: "Vacuna contra la rabia, aplicación anual" },
  { name: "Óctuple / Múltiple", description: "Cubre moquillo, parvovirus, hepatitis, entre otras" },
  { name: "Triple felina", description: "Panleucopenia, rinotraqueítis y calicivirus" },
  { name: "Leucemia felina", description: "Prevención de leucemia viral felina" },
  { name: "Bordetella", description: "Prevención de tos de las perreras" },
];

export async function seedVaccines(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  vaccines: count=0, se omite");
    return 0;
  }

  const existing = await Vaccine.count();
  if (existing > 0) {
    console.log(`⏭️  vaccines: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const rows = CATALOG.slice(0, count).map((item) => ({
    name: item.name,
    description: item.description,
    is_active: true,
  }));

  await Vaccine.bulkCreate(rows);
  console.log(`✅ vaccines: insertados ${rows.length} registro(s) del catálogo`);
  return rows.length;
}
