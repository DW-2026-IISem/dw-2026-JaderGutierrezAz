/**
 * Respuesta de login y refresh: el par de tokens.
 * refresh_token se devuelve en claro SOLO aquí: el servidor guarda únicamente
 * su hash SHA-256.
 */
export interface SessionTokensDto {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
}

/** Datos públicos del perfil propio. Nunca incluye password. */
export interface ProfileDto {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  status: "active" | "inactive";
}
