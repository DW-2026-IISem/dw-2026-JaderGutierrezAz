import { Application } from "express";
import { PayController } from "./pay.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature Pay. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class PayRoutes {
  public payController: PayController = new PayController();

  public routes(app: Application): void {
    app
      .route("/api/pagos")
      .get(authenticate, authorize, this.payController.getAll.bind(this.payController));

    app
      .route("/api/pagos/:id")
      .get(authenticate, authorize, this.payController.getOne.bind(this.payController));

    app
      .route("/api/pagos")
      .post(authenticate, authorize, this.payController.create.bind(this.payController));

    app
      .route("/api/pagos/:id")
      .put(authenticate, authorize, this.payController.updatePut.bind(this.payController))
      .patch(authenticate, authorize, this.payController.updatePatch.bind(this.payController));

    app
      .route("/api/pagos/:id")
      .delete(authenticate, authorize, this.payController.deletePhysical.bind(this.payController));

    app
      .route("/api/pagos/:id/deactivate")
      .patch(authenticate, authorize, this.payController.deleteLogical.bind(this.payController));
  }
}
