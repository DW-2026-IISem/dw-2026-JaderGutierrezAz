import { Application } from "express";
import { VaccineController } from "./vaccine.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature Vaccine. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class VaccineRoutes {
  public vaccineController: VaccineController = new VaccineController();

  public routes(app: Application): void {
    app
      .route("/api/vacunas")
      .get(this.vaccineController.getAll.bind(this.vaccineController));

    app
      .route("/api/vacunas/:id")
      .get(this.vaccineController.getOne.bind(this.vaccineController));

    app
      .route("/api/vacunas")
      .post(this.vaccineController.create.bind(this.vaccineController));

    app
      .route("/api/vacunas/:id")
      .put(this.vaccineController.updatePut.bind(this.vaccineController))
      .patch(this.vaccineController.updatePatch.bind(this.vaccineController));

    app
      .route("/api/vacunas/:id")
      .delete(this.vaccineController.deletePhysical.bind(this.vaccineController));

    app
      .route("/api/vacunas/:id/deactivate")
      .patch(this.vaccineController.deleteLogical.bind(this.vaccineController));
  }
}
