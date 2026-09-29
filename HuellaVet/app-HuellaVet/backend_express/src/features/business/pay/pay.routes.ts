import { Application } from "express";
import { PayController } from "./pay.controller";

export class PayRoutes {
  public payController: PayController = new PayController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/pagos")
      .get(this.payController.getAll.bind(this.payController));

    // getOne
    app
      .route("/api/pagos/:id")
      .get(this.payController.getOne.bind(this.payController));

    // create
    app
      .route("/api/pagos")
      .post(this.payController.create.bind(this.payController));

    // update (PUT / PATCH)
    app
      .route("/api/pagos/:id")
      .put(this.payController.updatePut.bind(this.payController))
      .patch(this.payController.updatePatch.bind(this.payController));

    // delete físico
    app
      .route("/api/pagos/:id")
      .delete(this.payController.deletePhysical.bind(this.payController));

    // delete lógico (cancelar)
    app
      .route("/api/pagos/:id/deactivate")
      .patch(this.payController.deleteLogical.bind(this.payController));
  }
}
