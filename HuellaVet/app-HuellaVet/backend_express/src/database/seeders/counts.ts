export type SeedCounts = {
  owners: number;
  pets: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  owners: 10,
  pets: 15,
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
