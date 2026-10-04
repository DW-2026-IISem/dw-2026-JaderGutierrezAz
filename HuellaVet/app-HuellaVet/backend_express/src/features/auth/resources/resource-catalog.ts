/**
 * Catálogo de los 103 recursos del sistema (fuente única).
 *
 * Un recurso es un par (method, path); un permiso es la concesión de ese
 * recurso a un rol. ADMIN recibe los 103; RECEPCIONISTA recibe el subconjunto
 * marcado con `receptionist: true` (análogo al SELLER de la guía: lectura de
 * catálogo + gestión de citas).
 *
 * Composición:
 *  Propietarios 7 · Mascotas 7 · Veterinarios 7 · Citas 7 · Consultas 7 ·
 *  Vacunas 7 · Lotes de vacunas 7 · Recetas 7 · Aplicaciones de vacunas 7 ·
 *  Pagos 7 (= 70 de negocio) · Usuarios 9 · Roles 7 · Recursos 7 ·
 *  Asignaciones usuario-rol 5 · Concesiones rol-recurso 5 = 103
 *
 * Nota: /api/sesion/* y /api/sesiones/* NO son recursos RBAC (OPEN / JWT).
 */
export interface CatalogResource {
  method: string;
  path: string;
  description: string;
  /** true si el rol RECEPCIONISTA recibe esta concesión. */
  receptionist?: boolean;
}

function crud(basePath: string, label: string, receptionistOps: string[] = []): CatalogResource[] {
  const ops: CatalogResource[] = [
    { method: "GET", path: basePath, description: `Listar ${label}` },
    { method: "GET", path: `${basePath}/:id`, description: `Consultar ${label}` },
    { method: "POST", path: basePath, description: `Crear ${label}` },
    { method: "PUT", path: `${basePath}/:id`, description: `Reemplazar ${label}` },
    { method: "PATCH", path: `${basePath}/:id`, description: `Modificar ${label}` },
    { method: "DELETE", path: `${basePath}/:id`, description: `Eliminar ${label}` },
    { method: "PATCH", path: `${basePath}/:id/deactivate`, description: `Desactivar ${label}` },
  ];
  for (const op of ops) {
    const key = `${op.method} ${op.path}`;
    if (receptionistOps.includes(key)) op.receptionist = true;
  }
  return ops;
}

export const RESOURCE_CATALOG: readonly CatalogResource[] = [
  // ── Propietarios (7) ──
  ...crud("/api/propietarios", "propietario", [
    "GET /api/propietarios",
    "GET /api/propietarios/:id",
  ]),

  // ── Mascotas (7) ──
  ...crud("/api/mascotas", "mascota", ["GET /api/mascotas", "GET /api/mascotas/:id"]),

  // ── Veterinarios (7) ──
  ...crud("/api/veterinarios", "veterinario", ["GET /api/veterinarios"]),

  // ── Citas (7) ──
  ...crud("/api/citas", "cita", [
    "GET /api/citas",
    "GET /api/citas/:id",
    "POST /api/citas",
    "PATCH /api/citas/:id/deactivate",
  ]),

  // ── Consultas (7) ──
  ...crud("/api/consultas", "consulta"),

  // ── Vacunas (7) ──
  ...crud("/api/vacunas", "vacuna"),

  // ── Lotes de vacunas (7) ──
  ...crud("/api/lotes-vacunas", "lote de vacuna"),

  // ── Recetas (7) ──
  ...crud("/api/recetas", "receta"),

  // ── Aplicaciones de vacunas (7) ──
  ...crud("/api/aplicaciones-vacunas", "aplicación de vacuna"),

  // ── Pagos (7) ──
  ...crud("/api/pagos", "pago"),

  // ── Usuarios (9) ──
  { method: "GET", path: "/api/usuarios", description: "Listar usuarios" },
  { method: "GET", path: "/api/usuarios/:id", description: "Consultar usuario" },
  { method: "POST", path: "/api/usuarios", description: "Crear usuario" },
  { method: "PUT", path: "/api/usuarios/:id", description: "Reemplazar usuario" },
  { method: "PATCH", path: "/api/usuarios/:id", description: "Modificar usuario" },
  { method: "DELETE", path: "/api/usuarios/:id", description: "Eliminar usuario" },
  { method: "PATCH", path: "/api/usuarios/:id/deactivate", description: "Desactivar usuario" },
  { method: "PATCH", path: "/api/usuarios/:id/password", description: "Cambiar contraseña de usuario" },
  {
    method: "GET",
    path: "/api/usuarios/:id/permisos",
    description: "Consultar permisos efectivos del usuario (endpoint pendiente, llega en ISS-12)",
  },

  // ── Roles (7) ──
  ...crud("/api/roles", "rol"),

  // ── Recursos (7) ──
  ...crud("/api/recursos", "recurso"),

  // ── Asignaciones usuario ↔ rol (5) ──
  { method: "GET", path: "/api/asignaciones-rol", description: "Listar asignaciones usuario-rol" },
  { method: "GET", path: "/api/asignaciones-rol/:id", description: "Consultar asignación usuario-rol" },
  { method: "POST", path: "/api/asignaciones-rol", description: "Asignar rol a usuario" },
  {
    method: "PATCH",
    path: "/api/asignaciones-rol/:id/deactivate",
    description: "Retirar rol a usuario",
  },
  {
    method: "PATCH",
    path: "/api/asignaciones-rol/:id/reactivate",
    description: "Reactivar rol a usuario",
  },

  // ── Concesiones rol ↔ recurso (5) ──
  { method: "GET", path: "/api/concesiones-rol", description: "Listar concesiones rol-recurso" },
  { method: "GET", path: "/api/concesiones-rol/:id", description: "Consultar concesión rol-recurso" },
  { method: "POST", path: "/api/concesiones-rol", description: "Conceder recurso a rol" },
  { method: "PATCH", path: "/api/concesiones-rol/:id/deactivate", description: "Retirar recurso a rol" },
  {
    method: "PATCH",
    path: "/api/concesiones-rol/:id/reactivate",
    description: "Reactivar recurso a rol",
  },
];

/** Recursos que recibe el rol RECEPCIONISTA. Derivado del catálogo, no duplicado. */
export const RECEPTIONIST_RESOURCES: readonly CatalogResource[] = RESOURCE_CATALOG.filter(
  (resource) => resource.receptionist === true
);
