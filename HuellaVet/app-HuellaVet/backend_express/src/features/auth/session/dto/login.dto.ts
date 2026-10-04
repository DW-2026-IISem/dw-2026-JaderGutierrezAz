/**
 * Datos de entrada de POST /api/sesion/login (modalidad OPEN).
 * identifier acepta usuario o correo: se busca por cualquiera de los dos.
 */
export interface LoginDto {
  identifier: string;
  password: string;
}
