import { Application } from "express";
import { VaccineBatchController } from "./vaccine-batch.controller";

export class VaccineBatchRoutes {
  public vaccineBatchController: VaccineBatchController = new VaccineBatchController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/lotes-vacunas")
      .get(this.vaccineBatchController.getAll.bind(this.vaccineBatchController));

    // getOne
    app
      .route("/api/lotes-vacunas/:id")
      .get(this.vaccineBatchController.getOne.bind(this.vaccineBatchController));

    // create
    app
      .route("/api/lotes-vacunas")
      .post(this.vaccineBatchController.create.bind(this.vaccineBatchController));

    // update (PUT / PATCH)
    app
      .route("/api/lotes-vacunas/:id")
      .put(this.vaccineBatchController.updatePut.bind(this.vaccineBatchController))
      .patch(this.vaccineBatchController.updatePatch.bind(this.vaccineBatchController));

    // delete físico
    app
      .route("/api/lotes-vacunas/:id")
      .delete(this.vaccineBatchController.deletePhysical.bind(this.vaccineBatchController));

    // delete lógico
    app
      .route("/api/lotes-vacunas/:id/deactivate")
      .patch(this.vaccineBatchController.deleteLogical.bind(this.vaccineBatchController));
  }
}
