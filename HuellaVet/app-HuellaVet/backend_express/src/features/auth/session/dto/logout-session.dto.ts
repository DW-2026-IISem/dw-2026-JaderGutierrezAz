/** Datos de entrada de POST /api/sesion/logout. Idempotente. */
export interface LogoutSessionDto {
  refresh_token: string;
}
