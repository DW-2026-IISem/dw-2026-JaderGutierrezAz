import { Application } from "express";
import { OwnerController } from "./owner.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature Owner. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class OwnerRoutes {
  public ownerController: OwnerController = new OwnerController();

  public routes(app: Application): void {
    app
      .route("/api/propietarios")
      .get(this.ownerController.getAll.bind(this.ownerController));

    app
      .route("/api/propietarios/:id")
      .get(this.ownerController.getOne.bind(this.ownerController));

    app
      .route("/api/propietarios")
      .post(this.ownerController.create.bind(this.ownerController));

    app
      .route("/api/propietarios/:id")
      .put(this.ownerController.updatePut.bind(this.ownerController))
      .patch(this.ownerController.updatePatch.bind(this.ownerController));

    app
      .route("/api/propietarios/:id")
      .delete(this.ownerController.deletePhysical.bind(this.ownerController));

    app
      .route("/api/propietarios/:id/deactivate")
      .patch(this.ownerController.deleteLogical.bind(this.ownerController));
  }
}