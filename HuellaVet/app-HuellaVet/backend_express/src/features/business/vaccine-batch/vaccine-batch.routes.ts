import { Application } from "express";
import { VaccineBatchController } from "./vaccine-batch.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature VaccineBatch. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class VaccineBatchRoutes {
  public vaccineBatchController: VaccineBatchController = new VaccineBatchController();

  public routes(app: Application): void {
    app
      .route("/api/lotes-vacunas")
      .get(authenticate, authorize, this.vaccineBatchController.getAll.bind(this.vaccineBatchController));

    app
      .route("/api/lotes-vacunas/:id")
      .get(authenticate, authorize, this.vaccineBatchController.getOne.bind(this.vaccineBatchController));

    app
      .route("/api/lotes-vacunas")
      .post(authenticate, authorize, this.vaccineBatchController.create.bind(this.vaccineBatchController));

    app
      .route("/api/lotes-vacunas/:id")
      .put(
        authenticate,
        authorize,
        this.vaccineBatchController.updatePut.bind(this.vaccineBatchController)
      )
      .patch(
        authenticate,
        authorize,
        this.vaccineBatchController.updatePatch.bind(this.vaccineBatchController)
      );

    app
      .route("/api/lotes-vacunas/:id")
      .delete(
        authenticate,
        authorize,
        this.vaccineBatchController.deletePhysical.bind(this.vaccineBatchController)
      );

    app
      .route("/api/lotes-vacunas/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.vaccineBatchController.deleteLogical.bind(this.vaccineBatchController)
      );
  }
}
