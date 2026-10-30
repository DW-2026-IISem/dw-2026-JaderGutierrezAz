import { Application } from "express";
import { VaccineBatchController } from "./vaccine-batch.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature VaccineBatch. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class VaccineBatchRoutes {
  public vaccineBatchController: VaccineBatchController = new VaccineBatchController();

  public routes(app: Application): void {
    app
      .route("/api/lotes-vacunas")
      .get(this.vaccineBatchController.getAll.bind(this.vaccineBatchController));

    app
      .route("/api/lotes-vacunas/:id")
      .get(this.vaccineBatchController.getOne.bind(this.vaccineBatchController));

    app
      .route("/api/lotes-vacunas")
      .post(this.vaccineBatchController.create.bind(this.vaccineBatchController));

    app
      .route("/api/lotes-vacunas/:id")
      .put(
        this.vaccineBatchController.updatePut.bind(this.vaccineBatchController)
      )
      .patch(
        this.vaccineBatchController.updatePatch.bind(this.vaccineBatchController)
      );

    app
      .route("/api/lotes-vacunas/:id")
      .delete(
        this.vaccineBatchController.deletePhysical.bind(this.vaccineBatchController)
      );

    app
      .route("/api/lotes-vacunas/:id/deactivate")
      .patch(
        this.vaccineBatchController.deleteLogical.bind(this.vaccineBatchController)
      );
  }
}
