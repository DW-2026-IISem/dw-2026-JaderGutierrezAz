import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/app-error";
import { sendError } from "../../../shared/http/error-response";

/**
 * MODALIDAD 3 — RBAC. STUB TEMPORAL (ISS-10/11).
 *
 * La implementación real consulta resource_roles -> roles -> role_users ->
 * resources, pero ese feature (ResourceRoles) no existe hasta ISS-12. Hasta
 * entonces, deny by default estricto: con identidad válida pero sin matriz
 * configurada, todo responde 403. Se reemplaza por la consulta real en
 * ISS-12/13, sin tocar las rutas que ya la usan (misma firma).
 */
export async function authorize(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.auth) {
      throw new AppError(401, "Authentication required");
    }
    throw new AppError(403, "RBAC matrix not configured yet (pending ISS-12/13)");
  } catch (error) {
    sendError(res, error);
  }
}
