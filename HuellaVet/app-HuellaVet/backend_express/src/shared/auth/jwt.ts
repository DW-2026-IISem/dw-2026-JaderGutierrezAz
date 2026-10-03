import jwt from "jsonwebtoken";
import { AppError } from "../errors/app-error";

/**
 * Firma y verificación del access token (JWT, HMAC SHA-256).
 *
 * El access token es *stateless*: una vez firmado, el servidor no necesita
 * consultar la base de datos para validarlo dentro de su ventana de vida
 * (por defecto 15 min) — solo verifica la firma y la expiración. Por eso es
 * corto: si un usuario se desactiva, el cambio no se refleja hasta que el
 * token expira (el middleware `authenticate`, en ISS-13, además revalida
 * contra la base para cerrar esa ventana).
 */

const JWT_SECRET = process.env.JWT_SECRET ?? "";
const JWT_ACCESS_TTL = Number(process.env.JWT_ACCESS_TTL ?? 900);

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET is missing or too short (minimum 32 characters). Check your .env file."
  );
}

/** Contenido mínimo que viaja dentro del access token. */
export interface AccessTokenPayload {
  sub: number; // user id
  username: string;
}

/** Firma un access token para el usuario dado. Expira en JWT_ACCESS_TTL segundos. */
export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_ACCESS_TTL });
}

/**
 * Verifica un access token y devuelve su payload.
 * Cualquier fallo (firma inválida, expirado, malformado) se traduce a
 * `AppError(401)` para que el middleware responda de forma uniforme.
 */
export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "string") {
      throw new AppError(401, "Invalid or expired access token");
    }
    return decoded as unknown as AccessTokenPayload;
  } catch {
    throw new AppError(401, "Invalid or expired access token");
  }
}
