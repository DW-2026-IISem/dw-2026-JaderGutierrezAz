export type SeedCounts = {
  owners: number;
  pets: number;
  veterinarians: number;
  appointments: number;
  consultations: number;
  vaccines: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  owners: 10,
  pets: 15,
  veterinarians: 6,
  appointments: 20,
  consultations: 15,
  vaccines: 5,
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
