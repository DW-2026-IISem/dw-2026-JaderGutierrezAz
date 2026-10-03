/**
 * Datos de entrada de PATCH /api/usuarios/:id/password.
 * Exige la contraseña actual: defensa en profundidad, ni un admin puede
 * cambiar una credencial ajena sin conocerla.
 */
export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
}
