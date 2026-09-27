import { Application } from "express";
import { VeterinarianController } from "./veterinarian.controller";

export class VeterinarianRoutes {
  public veterinarianController: VeterinarianController = new VeterinarianController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/veterinarios")
      .get(this.veterinarianController.getAll.bind(this.veterinarianController));

    // getOne
    app
      .route("/api/veterinarios/:id")
      .get(this.veterinarianController.getOne.bind(this.veterinarianController));

    // create
    app
      .route("/api/veterinarios")
      .post(this.veterinarianController.create.bind(this.veterinarianController));

    // update (PUT / PATCH)
    app
      .route("/api/veterinarios/:id")
      .put(this.veterinarianController.updatePut.bind(this.veterinarianController))
      .patch(this.veterinarianController.updatePatch.bind(this.veterinarianController));

    // delete físico
    app
      .route("/api/veterinarios/:id")
      .delete(this.veterinarianController.deletePhysical.bind(this.veterinarianController));

    // delete lógico
    app
      .route("/api/veterinarios/:id/deactivate")
      .patch(this.veterinarianController.deleteLogical.bind(this.veterinarianController));
  }
}
