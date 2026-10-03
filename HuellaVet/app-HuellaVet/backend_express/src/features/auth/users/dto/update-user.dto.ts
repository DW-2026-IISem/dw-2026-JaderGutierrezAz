/**
 * Datos de entrada de PUT /api/usuarios/:id (reemplazo completo).
 * password y status no están aquí: password tiene su propia operación
 * (PATCH /api/usuarios/:id/password); status solo cambia con /deactivate.
 */
export interface UpdateUserDto {
  username: string;
  email: string;
  avatar?: string | null;
}
