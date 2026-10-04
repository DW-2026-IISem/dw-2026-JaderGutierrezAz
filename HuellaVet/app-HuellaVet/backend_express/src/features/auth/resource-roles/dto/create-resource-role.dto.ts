/**
 * POST /api/concesiones-rol — conceder un recurso a un rol.
 * Crea el permiso: no es una entidad con nombre, es la tupla (role_id,
 * resource_id) materializada en resource_roles.
 */
export interface CreateResourceRoleDto {
  role_id: number;
  resource_id: number;
}
