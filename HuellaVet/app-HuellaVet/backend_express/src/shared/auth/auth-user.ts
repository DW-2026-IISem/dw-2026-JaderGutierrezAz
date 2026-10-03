import { Request } from "express";
import { AppError } from "../errors/app-error";

/**
 * Identidad resuelta que los middlewares de acceso dejan en la petición
 * (req.auth). La consumen los controllers JWT y el middleware `authorize`.
 */
export interface AuthUser {
  id: number;
  username: string;
  email?: string;
  tokenId?: string;
}

/** Devuelve la identidad de la petición o falla con 401. */
export function requireAuthUser(req: Request): AuthUser {
  if (!req.auth) {
    throw new AppError(401, "Authentication required");
  }
  return req.auth;
}

declare global {
  namespace Express {
    interface Request {
      /** Identidad resuelta por el middleware authenticate. undefined = OPEN. */
      auth?: AuthUser;
    }
  }
}

export {};
