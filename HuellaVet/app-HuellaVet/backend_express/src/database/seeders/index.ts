import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/business/owner/owner.model";
import "../../features/business/pet/pet.model";
import "../../features/business/pet/pet.associations";
import "../../features/business/veterinarian/veterinarian.model";
import "../../features/business/appointment/appointment.model";
import "../../features/business/appointment/appointment.associations";
import "../../features/business/consultation/consultation.model";
import "../../features/business/consultation/consultation.associations";
import { seedOwners } from "../../features/business/owner/owner.seeder";
import { seedPets } from "../../features/business/pet/pet.seeder";
import { seedVeterinarians } from "../../features/business/veterinarian/veterinarian.seeder";
import { seedAppointments } from "../../features/business/appointment/appointment.seeder";
import { seedConsultations } from "../../features/business/consultation/consultation.seeder";
import { resolveSeedCounts } from "./counts";

dotenv.config();

export async function runAllSeeders(): Promise<void> {
  const counts = resolveSeedCounts();
  console.log("🌱 Iniciando SeedersRunner...");
  console.log("📊 Conteos:", counts);

  const ok = await testConnection();
  if (!ok) {
    throw new Error("No hay conexión a la base de datos");
  }

  await sequelize.sync({ force: false, alter: true });

  // Orden: business (padres → hijos)
  await seedOwners(counts.owners);
  await seedPets(counts.pets);
  await seedVeterinarians(counts.veterinarians);
  await seedAppointments(counts.appointments);
  await seedConsultations(counts.consultations);

  console.log("🌱 SeedersRunner finalizado");
}

if (require.main === module) {
  runAllSeeders()
    .then(async () => {
      await sequelize.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Error en seeders:", err);
      await sequelize.close();
      process.exit(1);
    });
}
