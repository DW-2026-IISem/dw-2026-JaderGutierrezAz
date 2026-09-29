import { Application } from "express";
import { VaccineApplicationController } from "./vaccine-application.controller";

export class VaccineApplicationRoutes {
  public vaccineApplicationController: VaccineApplicationController = new VaccineApplicationController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/aplicaciones-vacunas")
      .get(this.vaccineApplicationController.getAll.bind(this.vaccineApplicationController));

    // getOne
    app
      .route("/api/aplicaciones-vacunas/:id")
      .get(this.vaccineApplicationController.getOne.bind(this.vaccineApplicationController));

    // create
    app
      .route("/api/aplicaciones-vacunas")
      .post(this.vaccineApplicationController.create.bind(this.vaccineApplicationController));

    // update (PUT / PATCH)
    app
      .route("/api/aplicaciones-vacunas/:id")
      .put(this.vaccineApplicationController.updatePut.bind(this.vaccineApplicationController))
      .patch(this.vaccineApplicationController.updatePatch.bind(this.vaccineApplicationController));

    // delete físico
    app
      .route("/api/aplicaciones-vacunas/:id")
      .delete(this.vaccineApplicationController.deletePhysical.bind(this.vaccineApplicationController));

    // delete lógico
    app
      .route("/api/aplicaciones-vacunas/:id/deactivate")
      .patch(this.vaccineApplicationController.deleteLogical.bind(this.vaccineApplicationController));
  }
}
