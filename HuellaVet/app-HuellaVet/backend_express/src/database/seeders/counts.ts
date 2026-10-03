export type SeedCounts = {
  owners: number;
  pets: number;
  veterinarians: number;
  appointments: number;
  consultations: number;
  vaccines: number;
  vaccineBatches: number;
  recipes: number;
  vaccineApplications: number;
  pays: number;
  users: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  owners: 10,
  pets: 15,
  veterinarians: 6,
  appointments: 20,
  consultations: 15,
  vaccines: 5,
  vaccineBatches: 10,
  recipes: 15,
  vaccineApplications: 15,
  pays: 20,
  users: 2,
};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };

  const envOwners = process.env.SEED_OWNERS;
  if (envOwners !== undefined && envOwners !== "") {
    counts.owners = Number(envOwners);
  }

  const envPets = process.env.SEED_PETS;
  if (envPets !== undefined && envPets !== "") {
    counts.pets = Number(envPets);
  }

  const envVets = process.env.SEED_VETERINARIANS;
  if (envVets !== undefined && envVets !== "") {
    counts.veterinarians = Number(envVets);
  }

  const envAppointments = process.env.SEED_APPOINTMENTS;
  if (envAppointments !== undefined && envAppointments !== "") {
    counts.appointments = Number(envAppointments);
  }

  const envConsultations = process.env.SEED_CONSULTATIONS;
  if (envConsultations !== undefined && envConsultations !== "") {
    counts.consultations = Number(envConsultations);
  }

  const envVaccines = process.env.SEED_VACCINES;
  if (envVaccines !== undefined && envVaccines !== "") {
    counts.vaccines = Number(envVaccines);
  }

  const envVaccineBatches = process.env.SEED_VACCINE_BATCHES;
  if (envVaccineBatches !== undefined && envVaccineBatches !== "") {
    counts.vaccineBatches = Number(envVaccineBatches);
  }

  const envRecipes = process.env.SEED_RECIPES;
  if (envRecipes !== undefined && envRecipes !== "") {
    counts.recipes = Number(envRecipes);
  }

  const envVaccineApplications = process.env.SEED_VACCINE_APPLICATIONS;
  if (envVaccineApplications !== undefined && envVaccineApplications !== "") {
    counts.vaccineApplications = Number(envVaccineApplications);
  }

  const envPays = process.env.SEED_PAYS;
  if (envPays !== undefined && envPays !== "") {
    counts.pays = Number(envPays);
  }

  const envUsers = process.env.SEED_USERS;
  if (envUsers !== undefined && envUsers !== "") {
    counts.users = Number(envUsers);
  }

  for (const arg of argv) {
    const m = arg.match(/^--([a-zA-Z_]+)=(\d+)$/);
    if (!m) continue;
    const key = m[1] as keyof SeedCounts;
    const value = Number(m[2]);
    if (key in counts) {
      counts[key] = value;
    }
  }

  return counts;
}
