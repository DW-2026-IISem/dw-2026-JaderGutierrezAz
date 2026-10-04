import { Application } from "express";
import { OwnerController } from "./owner.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature Owner. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class OwnerRoutes {
  public ownerController: OwnerController = new OwnerController();

  public routes(app: Application): void {
    app
      .route("/api/propietarios")
      .get(authenticate, authorize, this.ownerController.getAll.bind(this.ownerController));

    app
      .route("/api/propietarios/:id")
      .get(authenticate, authorize, this.ownerController.getOne.bind(this.ownerController));

    app
      .route("/api/propietarios")
      .post(authenticate, authorize, this.ownerController.create.bind(this.ownerController));

    app
      .route("/api/propietarios/:id")
      .put(authenticate, authorize, this.ownerController.updatePut.bind(this.ownerController))
      .patch(authenticate, authorize, this.ownerController.updatePatch.bind(this.ownerController));

    app
      .route("/api/propietarios/:id")
      .delete(authenticate, authorize, this.ownerController.deletePhysical.bind(this.ownerController));

    app
      .route("/api/propietarios/:id/deactivate")
      .patch(authenticate, authorize, this.ownerController.deleteLogical.bind(this.ownerController));
  }
}
