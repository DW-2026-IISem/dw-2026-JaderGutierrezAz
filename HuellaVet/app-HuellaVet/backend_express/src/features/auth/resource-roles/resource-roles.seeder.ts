import { Resource } from "../resources/resource.model";
import { Role } from "../roles/role.model";
import { RESOURCE_CATALOG, RECEPTIONIST_RESOURCES } from "../resources/resource-catalog";
import { ResourceRolesService } from "./resource-roles.service";

/**
 * Seeder de la matriz de permisos. ADMIN -> los 103 recursos; RECEPCIONISTA ->
 * los 9 de operación (propietarios/mascotas/veterinarios de solo lectura +
 * gestión de citas). reconcileRole es determinista: reejecutar el seeder no
 * acumula permisos.
 */
export async function seedResourceRoles(): Promise<number> {
  const service = new ResourceRolesService();

  const resources = await Resource.findAll({ where: { status: "active" } });
  const idByOperation = new Map(
    resources.map((resource) => [`${resource.method} ${resource.path}`, resource.id])
  );

  const idsFor = (catalog: ReadonlyArray<{ method: string; path: string }>): number[] =>
    catalog
      .map((item) => idByOperation.get(`${item.method} ${item.path}`))
      .filter((id): id is number => typeof id === "number");

  let total = 0;

  const admin = await Role.findOne({ where: { name: "ADMIN" } });
  if (admin) {
    const result = await service.reconcileRole(admin.id, idsFor(RESOURCE_CATALOG));
    console.log(
      `✅ resource_roles: ADMIN -> ${result.total_active} recursos (${result.activated} altas, ${result.deactivated} bajas)`
    );
    total += result.total_active;
  }

  const receptionist = await Role.findOne({ where: { name: "RECEPCIONISTA" } });
  if (receptionist) {
    const result = await service.reconcileRole(receptionist.id, idsFor(RECEPTIONIST_RESOURCES));
    console.log(
      `✅ resource_roles: RECEPCIONISTA -> ${result.total_active} recursos (${result.activated} altas, ${result.deactivated} bajas)`
    );
    total += result.total_active;
  }

  return total;
}
