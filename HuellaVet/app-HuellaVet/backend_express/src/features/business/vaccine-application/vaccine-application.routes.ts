import { Application } from "express";
import { VaccineApplicationController } from "./vaccine-application.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature VaccineApplication. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class VaccineApplicationRoutes {
  public vaccineApplicationController: VaccineApplicationController =
    new VaccineApplicationController();

  public routes(app: Application): void {
    app
      .route("/api/aplicaciones-vacunas")
      .get(
        this.vaccineApplicationController.getAll.bind(this.vaccineApplicationController)
      );

    app
      .route("/api/aplicaciones-vacunas/:id")
      .get(
        this.vaccineApplicationController.getOne.bind(this.vaccineApplicationController)
      );

    app
      .route("/api/aplicaciones-vacunas")
      .post(
        this.vaccineApplicationController.create.bind(this.vaccineApplicationController)
      );

    app
      .route("/api/aplicaciones-vacunas/:id")
      .put(
        this.vaccineApplicationController.updatePut.bind(this.vaccineApplicationController)
      )
      .patch(
        this.vaccineApplicationController.updatePatch.bind(this.vaccineApplicationController)
      );

    app
      .route("/api/aplicaciones-vacunas/:id")
      .delete(
        this.vaccineApplicationController.deletePhysical.bind(this.vaccineApplicationController)
      );

    app
      .route("/api/aplicaciones-vacunas/:id/deactivate")
      .patch(
        this.vaccineApplicationController.deleteLogical.bind(this.vaccineApplicationController)
      );
  }
}
