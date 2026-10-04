import { Application } from "express";
import { PetController } from "./pet.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature Pet. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class PetRoutes {
  public petController: PetController = new PetController();

  public routes(app: Application): void {
    app
      .route("/api/mascotas")
      .get(authenticate, authorize, this.petController.getAll.bind(this.petController));

    app
      .route("/api/mascotas/:id")
      .get(authenticate, authorize, this.petController.getOne.bind(this.petController));

    app
      .route("/api/mascotas")
      .post(authenticate, authorize, this.petController.create.bind(this.petController));

    app
      .route("/api/mascotas/:id")
      .put(authenticate, authorize, this.petController.updatePut.bind(this.petController))
      .patch(authenticate, authorize, this.petController.updatePatch.bind(this.petController));

    app
      .route("/api/mascotas/:id")
      .delete(authenticate, authorize, this.petController.deletePhysical.bind(this.petController));

    app
      .route("/api/mascotas/:id/deactivate")
      .patch(authenticate, authorize, this.petController.deleteLogical.bind(this.petController));
  }
}
