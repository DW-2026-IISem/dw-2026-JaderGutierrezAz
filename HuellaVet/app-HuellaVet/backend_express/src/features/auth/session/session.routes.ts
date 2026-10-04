import { Application } from "express";
import { SessionController } from "./session.controller";
import { authenticate } from "../access";

export class SessionRoutes {
  public sessionController: SessionController = new SessionController();

  public routes(app: Application): void {
    // login (OPEN)
    app.route("/api/sesion/login").post(this.sessionController.login.bind(this.sessionController));

    // refresh (OPEN + refresh token)
    app
      .route("/api/sesion/refresh")
      .post(this.sessionController.refresh.bind(this.sessionController));

    // logout (OPEN + refresh token)
    app
      .route("/api/sesion/logout")
      .post(this.sessionController.logout.bind(this.sessionController));

    // perfil (JWT)
    app
      .route("/api/sesion/perfil")
      .get(authenticate, this.sessionController.profile.bind(this.sessionController));

    // permisos efectivos del usuario autenticado (JWT)
    app
      .route("/api/permisos")
      .get(authenticate, this.sessionController.myPermissions.bind(this.sessionController));
  }
}
