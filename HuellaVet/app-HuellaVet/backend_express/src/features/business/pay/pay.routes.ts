import { Application } from "express";
import { PayController } from "./pay.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature Pay. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class PayRoutes {
  public payController: PayController = new PayController();

  public routes(app: Application): void {
    app
      .route("/api/pagos")
      .get(this.payController.getAll.bind(this.payController));

    app
      .route("/api/pagos/:id")
      .get(this.payController.getOne.bind(this.payController));

    app
      .route("/api/pagos")
      .post(this.payController.create.bind(this.payController));

    app
      .route("/api/pagos/:id")
      .put(this.payController.updatePut.bind(this.payController))
      .patch(this.payController.updatePatch.bind(this.payController));

    app
      .route("/api/pagos/:id")
      .delete(this.payController.deletePhysical.bind(this.payController));

    app
      .route("/api/pagos/:id/deactivate")
      .patch(this.payController.deleteLogical.bind(this.payController));
  }
}
