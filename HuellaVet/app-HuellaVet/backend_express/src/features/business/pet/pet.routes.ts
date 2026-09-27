import { Application } from "express";
import { PetController } from "./pet.controller";

export class PetRoutes {
  public petController: PetController = new PetController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    app
      .route("/api/mascotas")
      .get(this.petController.getAll.bind(this.petController))
      .post(this.petController.create.bind(this.petController));

    app
      .route("/api/mascotas/:id")
      .get(this.petController.getOne.bind(this.petController))
      .put(this.petController.updatePut.bind(this.petController))
      .patch(this.petController.updatePatch.bind(this.petController))
      .delete(this.petController.deletePhysical.bind(this.petController));

    app
      .route("/api/mascotas/:id/deactivate")
      .patch(this.petController.deleteLogical.bind(this.petController));
  }
}
