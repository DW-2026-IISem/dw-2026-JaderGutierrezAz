import { Application } from "express";
import { RefreshTokensController } from "./refresh-tokens.controller";
import { authenticate } from "../access";

/**
 * Rutas del feature RefreshTokens — modalidad JWT (sin RBAC).
 * Nota de enrutado: /api/sesiones/deactivate-all es una ruta LITERAL, se
 * registra antes que /api/sesiones/:id/deactivate para que no haya ambigüedad.
 */
export class RefreshTokensRoutes {
  public refreshTokensController: RefreshTokensController = new RefreshTokensController();

  public routes(app: Application): void {
    app
      .route("/api/sesiones")
      .get(authenticate, this.refreshTokensController.getAll.bind(this.refreshTokensController));

    app
      .route("/api/sesiones/deactivate-all")
      .patch(
        authenticate,
        this.refreshTokensController.revokeAll.bind(this.refreshTokensController)
      );

    app
      .route("/api/sesiones/:id")
      .get(authenticate, this.refreshTokensController.getOne.bind(this.refreshTokensController));

    app
      .route("/api/sesiones/:id/deactivate")
      .patch(
        authenticate,
        this.refreshTokensController.revokeOne.bind(this.refreshTokensController)
      );

    app
      .route("/api/sesiones")
      .delete(authenticate, this.refreshTokensController.purge.bind(this.refreshTokensController));
  }
}
