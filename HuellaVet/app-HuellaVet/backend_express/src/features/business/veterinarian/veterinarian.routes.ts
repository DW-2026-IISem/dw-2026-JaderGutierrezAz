import { Application } from "express";
import { VeterinarianController } from "./veterinarian.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature Veterinarian. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class VeterinarianRoutes {
  public veterinarianController: VeterinarianController = new VeterinarianController();

  public routes(app: Application): void {
    app
      .route("/api/veterinarios")
      .get(authenticate, authorize, this.veterinarianController.getAll.bind(this.veterinarianController));

    app
      .route("/api/veterinarios/:id")
      .get(authenticate, authorize, this.veterinarianController.getOne.bind(this.veterinarianController));

    app
      .route("/api/veterinarios")
      .post(authenticate, authorize, this.veterinarianController.create.bind(this.veterinarianController));

    app
      .route("/api/veterinarios/:id")
      .put(
        authenticate,
        authorize,
        this.veterinarianController.updatePut.bind(this.veterinarianController)
      )
      .patch(
        authenticate,
        authorize,
        this.veterinarianController.updatePatch.bind(this.veterinarianController)
      );

    app
      .route("/api/veterinarios/:id")
      .delete(
        authenticate,
        authorize,
        this.veterinarianController.deletePhysical.bind(this.veterinarianController)
      );

    app
      .route("/api/veterinarios/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.veterinarianController.deleteLogical.bind(this.veterinarianController)
      );
  }
}
