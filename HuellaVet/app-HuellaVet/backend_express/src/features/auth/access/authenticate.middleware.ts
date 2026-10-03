import { NextFunction, Request, Response } from "express";
import "../../../shared/auth/auth-user";
import { AppError } from "../../../shared/errors/app-error";
import { sendError } from "../../../shared/http/error-response";
import { extractBearerToken, verifyAccessToken } from "../../../shared/auth/jwt";
import { UsersRepository } from "../users/users.repository";

/**
 * MODALIDAD 2 — JWT (identidad). Responde solo a "¿quién eres?":
 *  1. Lee el token de Authorization: Bearer <token>.
 *  2. Verifica firma, iss, aud, exp.
 *  3. Revalida contra la BD que el usuario sigue existiendo y activo (así la
 *     desactivación de una cuenta tiene efecto inmediato aunque el token siga
 *     firmado y vigente).
 * NO consulta la matriz de permisos: eso es authorize.
 */
const usersRepository = new UsersRepository();

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) {
      throw new AppError(401, "Missing Bearer token");
    }

    const payload = verifyAccessToken(token);

    const userId = Number(payload.sub);
    if (!Number.isInteger(userId) || userId < 1) {
      throw new AppError(401, "Invalid or expired access token");
    }

    const user = await usersRepository.findById(userId);
    if (!user || user.status !== "active") {
      throw new AppError(401, "User is not active");
    }

    req.auth = {
      id: user.id,
      username: user.username,
      email: user.email,
      tokenId: payload.jti,
    };
    next();
  } catch (error) {
    sendError(res, error);
  }
}
