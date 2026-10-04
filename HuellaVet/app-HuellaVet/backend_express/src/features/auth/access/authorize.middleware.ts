import { NextFunction, Request, Response } from "express";
import "../../../shared/auth/auth-user";
import { AppError } from "../../../shared/errors/app-error";
import { sendError } from "../../../shared/http/error-response";
import { isOperationGranted, normalizePath } from "../../../shared/auth/resource-match";
import { ResourceRolesRepository } from "../resource-roles/resource-roles.repository";

/**
 * MODALIDAD 3 — RBAC. Debe montarse después de authenticate.
 * Responde: ¿puede esta identidad ejecutar method+path?
 *
 *  1. Toma req.auth (ya resuelto por authenticate).
 *  2. Consulta la cadena completa resource_roles -> roles -> role_users ->
 *     resources (todos activos) para ese user_id.
 *  3. Compara (method, path) de la petición contra las concesiones, por patrón.
 *
 * Deny by default: sin concesión activa -> 403. Esta es la implementación
 * real que reemplaza el stub de ISS-10/11 (que siempre daba 403).
 */
const resourceRolesRepository = new ResourceRolesRepository();

export async function authorize(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.auth) {
      throw new AppError(401, "Authentication required");
    }

    const method = req.method.toUpperCase();
    const path = normalizePath(req.originalUrl);

    const granted = await resourceRolesRepository.findEffectiveForUser(req.auth.id);

    if (!isOperationGranted(granted, method, path)) {
      throw new AppError(403, `Forbidden: no grant for ${method} ${path}`);
    }

    next();
  } catch (error) {
    sendError(res, error);
  }
}
