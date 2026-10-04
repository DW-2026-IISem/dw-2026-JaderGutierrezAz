import { ResourceRole, ResourceRoleI } from "../resource-role.model";

export interface ResourceRoleResponseDto extends ResourceRoleI {
  role?: { id: number; name: string } | null;
  resource?: { id: number; method: string; path: string; description: string | null } | null;
}

export function toResourceRoleResponse(resourceRole: ResourceRole): ResourceRoleResponseDto {
  return resourceRole.toJSON() as ResourceRoleResponseDto;
}

/** Permiso efectivo: resultado de recorrer role_users -> roles -> resource_roles -> resources. */
export interface EffectivePermissionDto {
  resource_id: number;
  method: string;
  path: string;
  description: string | null;
  role_id: number;
  role_name: string;
}
