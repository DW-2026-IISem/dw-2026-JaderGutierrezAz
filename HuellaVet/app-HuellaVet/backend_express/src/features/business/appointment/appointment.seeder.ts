import { faker } from "@faker-js/faker";
import { Appointment } from "./appointment.model";
import { Pet } from "../pet/pet.model";
import { Veterinarian } from "../veterinarian/veterinarian.model";

/**
 * Seeder del feature Appointment (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere pets y veterinarians activos. Idempotente: si ya hay filas, no inserta.
 */
export async function seedAppointments(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  appointments: count=0, se omite");
    return 0;
  }

  const existing = await Appointment.count();
  if (existing > 0) {
    console.log(`⏭️  appointments: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const pets = await Pet.findAll({ where: { is_active: true } });
  const veterinarians = await Veterinarian.findAll({ where: { is_active: true } });

  if (pets.length === 0 || veterinarians.length === 0) {
    console.log("⏭️  appointments: no hay pets/veterinarians activos, se omite seeder");
    return 0;
  }

  const reasons = ["Control anual", "Vacunación", "Desparasitación", "Consulta general", "Cirugía menor"];

  const rows = Array.from({ length: count }, () => {
    const pet = pets[Math.floor(Math.random() * pets.length)];
    const vet = veterinarians[Math.floor(Math.random() * veterinarians.length)];
    const start = faker.date.soon({ days: 30 });
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    return {
      pet_id: pet.id,
      veterinarian_id: vet.id,
      start_date: start,
      end_date: end,
      reason: faker.helpers.arrayElement(reasons),
      state: "scheduled" as const,
    };
  });

  await Appointment.bulkCreate(rows);
  console.log(`✅ appointments: insertados ${count} registro(s) falsos`);
  return count;
}
