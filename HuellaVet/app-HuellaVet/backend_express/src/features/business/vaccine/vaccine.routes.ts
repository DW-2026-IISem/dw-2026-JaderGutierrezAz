import { Application } from "express";
import { VaccineController } from "./vaccine.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature Vaccine. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class VaccineRoutes {
  public vaccineController: VaccineController = new VaccineController();

  public routes(app: Application): void {
    app
      .route("/api/vacunas")
      .get(authenticate, authorize, this.vaccineController.getAll.bind(this.vaccineController));

    app
      .route("/api/vacunas/:id")
      .get(authenticate, authorize, this.vaccineController.getOne.bind(this.vaccineController));

    app
      .route("/api/vacunas")
      .post(authenticate, authorize, this.vaccineController.create.bind(this.vaccineController));

    app
      .route("/api/vacunas/:id")
      .put(authenticate, authorize, this.vaccineController.updatePut.bind(this.vaccineController))
      .patch(authenticate, authorize, this.vaccineController.updatePatch.bind(this.vaccineController));

    app
      .route("/api/vacunas/:id")
      .delete(authenticate, authorize, this.vaccineController.deletePhysical.bind(this.vaccineController));

    app
      .route("/api/vacunas/:id/deactivate")
      .patch(authenticate, authorize, this.vaccineController.deleteLogical.bind(this.vaccineController));
  }
}
