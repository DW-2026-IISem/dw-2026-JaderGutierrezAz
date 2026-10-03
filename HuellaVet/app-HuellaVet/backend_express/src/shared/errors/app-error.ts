/**
 * Error de aplicación con código HTTP explícito.
 *
 * Es el único tipo de error que el controller (vía BaseController) traduce a
 * una respuesta con sentido (`statusCode` + `message`). Cualquier otro error
 * (uno inesperado, de Sequelize, etc.) se trata como 500.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}
