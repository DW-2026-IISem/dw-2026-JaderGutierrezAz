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
import "../../features/business/vaccine/vaccine.model";
import "../../features/business/vaccine-batch/vaccine-batch.model";
import "../../features/business/vaccine-batch/vaccine-batch.associations";
import "../../features/business/recipe/recipe.model";
import "../../features/business/recipe/recipe.associations";
import "../../features/business/vaccine-application/vaccine-application.model";
import "../../features/business/vaccine-application/vaccine-application.associations";
import "../../features/business/pay/pay.model";
import "../../features/auth/users/user.model";
import "../../features/auth/roles/role.model";
import "../../features/auth/resources/resource.model";
import "../../features/auth/role-users/role-user.model";
import "../../features/auth/resource-roles/resource-role.model";
import "../../features/auth/refresh-tokens/refresh-token.model";
import "../../features/auth/rbac.associations";
import { seedUsers } from "../../features/auth/users/users.seeder";
import { seedOwners } from "../../features/business/owner/owner.seeder";
import { seedPets } from "../../features/business/pet/pet.seeder";
import { seedVeterinarians } from "../../features/business/veterinarian/veterinarian.seeder";
import { seedAppointments } from "../../features/business/appointment/appointment.seeder";
import { seedConsultations } from "../../features/business/consultation/consultation.seeder";
import { seedVaccines } from "../../features/business/vaccine/vaccine.seeder";
import { seedVaccineBatches } from "../../features/business/vaccine-batch/vaccine-batch.seeder";
import { seedRecipes } from "../../features/business/recipe/recipe.seeder";
import { seedVaccineApplications } from "../../features/business/vaccine-application/vaccine-application.seeder";
import { seedPays } from "../../features/business/pay/pay.seeder";
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

  await seedOwners(counts.owners);
  await seedPets(counts.pets);
  await seedVeterinarians(counts.veterinarians);
  await seedAppointments(counts.appointments);
  await seedConsultations(counts.consultations);
  await seedVaccines(counts.vaccines);
  await seedVaccineBatches(counts.vaccineBatches);
  await seedRecipes(counts.recipes);
  await seedVaccineApplications(counts.vaccineApplications);
  await seedPays(counts.pays);

  // Fase II — Auth: los seeders de users/roles/etc. se añaden en ISS-10+

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
