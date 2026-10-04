/**
 * POST /api/asignaciones-rol — asignar un rol a un usuario.
 * Si la pareja (user_id, role_id) ya existía inactiva, se reactiva en vez de
 * duplicarla (restricción única (user_id, role_id)).
 */
export interface CreateRoleUserDto {
  user_id: number;
  role_id: number;
}
