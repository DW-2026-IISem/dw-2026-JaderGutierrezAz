import { Application } from "express";
import { OwnerController } from "./owner.controller";

export class OwnerRoutes {
  public ownerController: OwnerController = new OwnerController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/propietarios")
      .get(this.ownerController.getAll.bind(this.ownerController));

    // getOne
    app
      .route("/api/propietarios/:id")
      .get(this.ownerController.getOne.bind(this.ownerController));

    // create
    app
      .route("/api/propietarios")
      .post(this.ownerController.create.bind(this.ownerController));

    // update (PUT / PATCH)
    app
      .route("/api/propietarios/:id")
      .put(this.ownerController.updatePut.bind(this.ownerController))
      .patch(this.ownerController.updatePatch.bind(this.ownerController));
  }
}
