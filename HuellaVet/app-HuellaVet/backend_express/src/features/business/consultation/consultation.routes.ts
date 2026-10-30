import { Application } from "express";
import { ConsultationController } from "./consultation.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature Consultation. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class ConsultationRoutes {
  public consultationController: ConsultationController = new ConsultationController();

  public routes(app: Application): void {
    app
      .route("/api/consultas")
      .get(this.consultationController.getAll.bind(this.consultationController));

    app
      .route("/api/consultas/:id")
      .get(this.consultationController.getOne.bind(this.consultationController));

    app
      .route("/api/consultas")
      .post(this.consultationController.create.bind(this.consultationController));

    app
      .route("/api/consultas/:id")
      .put(
        this.consultationController.updatePut.bind(this.consultationController)
      )
      .patch(
        this.consultationController.updatePatch.bind(this.consultationController)
      );

    app
      .route("/api/consultas/:id")
      .delete(
        this.consultationController.deletePhysical.bind(this.consultationController)
      );

    app
      .route("/api/consultas/:id/deactivate")
      .patch(
        this.consultationController.deleteLogical.bind(this.consultationController)
      );
  }
}
