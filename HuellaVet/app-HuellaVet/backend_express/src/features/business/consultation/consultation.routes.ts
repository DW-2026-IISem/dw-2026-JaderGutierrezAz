import { Application } from "express";
import { ConsultationController } from "./consultation.controller";

export class ConsultationRoutes {
  public consultationController: ConsultationController = new ConsultationController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/consultas")
      .get(this.consultationController.getAll.bind(this.consultationController));

    // getOne
    app
      .route("/api/consultas/:id")
      .get(this.consultationController.getOne.bind(this.consultationController));

    // create
    app
      .route("/api/consultas")
      .post(this.consultationController.create.bind(this.consultationController));

    // update (PUT / PATCH)
    app
      .route("/api/consultas/:id")
      .put(this.consultationController.updatePut.bind(this.consultationController))
      .patch(this.consultationController.updatePatch.bind(this.consultationController));

    // delete físico
    app
      .route("/api/consultas/:id")
      .delete(this.consultationController.deletePhysical.bind(this.consultationController));

    // delete lógico
    app
      .route("/api/consultas/:id/deactivate")
      .patch(this.consultationController.deleteLogical.bind(this.consultationController));
  }
}
