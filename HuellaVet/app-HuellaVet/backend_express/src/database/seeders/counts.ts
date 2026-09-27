/**
 * Cantidad de registros por feature/entidad.
 * Prioridad: CLI (--owners=N) > env (SEED_OWNERS) > default de este archivo.
 *
 * Cuando agregues features, suma aquí la clave y léela en el runner.
 */
export type SeedCounts = {
  owners: number;
  // pets?: number;
  // veterinarians?: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  owners: 10,
};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };

  const envOwners = process.env.SEED_OWNERS;
  if (envOwners !== undefined && envOwners !== "") {
    counts.owners = Number(envOwners);
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
