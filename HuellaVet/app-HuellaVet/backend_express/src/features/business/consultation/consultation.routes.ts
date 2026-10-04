import { Application } from "express";
import { ConsultationController } from "./consultation.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature Consultation. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class ConsultationRoutes {
  public consultationController: ConsultationController = new ConsultationController();

  public routes(app: Application): void {
    app
      .route("/api/consultas")
      .get(authenticate, authorize, this.consultationController.getAll.bind(this.consultationController));

    app
      .route("/api/consultas/:id")
      .get(authenticate, authorize, this.consultationController.getOne.bind(this.consultationController));

    app
      .route("/api/consultas")
      .post(authenticate, authorize, this.consultationController.create.bind(this.consultationController));

    app
      .route("/api/consultas/:id")
      .put(
        authenticate,
        authorize,
        this.consultationController.updatePut.bind(this.consultationController)
      )
      .patch(
        authenticate,
        authorize,
        this.consultationController.updatePatch.bind(this.consultationController)
      );

    app
      .route("/api/consultas/:id")
      .delete(
        authenticate,
        authorize,
        this.consultationController.deletePhysical.bind(this.consultationController)
      );

    app
      .route("/api/consultas/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.consultationController.deleteLogical.bind(this.consultationController)
      );
  }
}
