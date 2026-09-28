import { Application } from "express";
import { VaccineController } from "./vaccine.controller";

export class VaccineRoutes {
  public vaccineController: VaccineController = new VaccineController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/vacunas")
      .get(this.vaccineController.getAll.bind(this.vaccineController));

    // getOne
    app
      .route("/api/vacunas/:id")
      .get(this.vaccineController.getOne.bind(this.vaccineController));

    // create
    app
      .route("/api/vacunas")
      .post(this.vaccineController.create.bind(this.vaccineController));

    // update (PUT / PATCH)
    app
      .route("/api/vacunas/:id")
      .put(this.vaccineController.updatePut.bind(this.vaccineController))
      .patch(this.vaccineController.updatePatch.bind(this.vaccineController));

    // delete físico
    app
      .route("/api/vacunas/:id")
      .delete(this.vaccineController.deletePhysical.bind(this.vaccineController));

    // delete lógico
    app
      .route("/api/vacunas/:id/deactivate")
      .patch(this.vaccineController.deleteLogical.bind(this.vaccineController));
  }
}
