import { Response } from "express";
import { AppError } from "../errors/app-error";

/**
 * Traduce cualquier error a una respuesta HTTP. Único punto del proyecto
 * donde se decide el mapeo error -> status.
 *
 * Lo usan: BaseController.handleError, y los middlewares de acceso
 * (authenticate/authorize), que responden 401/403 sin pasar por un controller.
 */
export function sendError(res: Response, error: unknown): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  res.status(500).json({ error: "Internal server error", detail: String(error) });
}
