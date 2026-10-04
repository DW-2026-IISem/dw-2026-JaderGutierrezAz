/** PUT /api/roles/:id. status no está aquí: solo cambia con el borrado lógico. */
export interface UpdateRoleDto {
  name: string;
  description?: string | null;
}
