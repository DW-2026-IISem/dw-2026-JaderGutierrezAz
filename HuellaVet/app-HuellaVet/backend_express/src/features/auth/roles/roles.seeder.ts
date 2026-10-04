import { Role } from "./role.model";

/**
 * Seeder del catálogo de roles. Determinista e idempotente: findOrCreate por
 * nombre + reactivación si ya existía inactivo. Nacen SIN permisos; las
 * concesiones las crea el seeder de resource_roles en ISS-12 (ADMIN recibe
 * los 103 recursos; RECEPCIONISTA, el subconjunto de operación).
 */
export const SEED_ROLES = [
  { name: "ADMIN", description: "Administración del sistema: usuarios, roles y permisos" },
  {
    name: "RECEPCIONISTA",
    description: "Operación de recepción: consulta propietarios/mascotas/veterinarios y gestiona citas",
  },
] as const;

export async function seedRoles(): Promise<number> {
  let created = 0;

  for (const item of SEED_ROLES) {
    const [role, wasCreated] = await Role.findOrCreate({
      where: { name: item.name },
      defaults: { name: item.name, description: item.description, status: "active" },
    });

    if (wasCreated) {
      created++;
      continue;
    }
    if (role.status !== "active") {
      await role.update({ status: "active" });
    }
  }

  console.log(`✅ roles: catálogo reconciliado (${SEED_ROLES.length} roles, ${created} nuevos)`);
  return created;
}
