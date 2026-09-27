import { Application } from "express";
import { AppointmentController } from "./appointment.controller";

export class AppointmentRoutes {
  public appointmentController: AppointmentController = new AppointmentController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/citas")
      .get(this.appointmentController.getAll.bind(this.appointmentController));

    // getOne
    app
      .route("/api/citas/:id")
      .get(this.appointmentController.getOne.bind(this.appointmentController));

    // create
    app
      .route("/api/citas")
      .post(this.appointmentController.create.bind(this.appointmentController));

    // update (PUT / PATCH)
    app
      .route("/api/citas/:id")
      .put(this.appointmentController.updatePut.bind(this.appointmentController))
      .patch(this.appointmentController.updatePatch.bind(this.appointmentController));

    // delete físico
    app
      .route("/api/citas/:id")
      .delete(this.appointmentController.deletePhysical.bind(this.appointmentController));

    // delete lógico (cancelar)
    app
      .route("/api/citas/:id/deactivate")
      .patch(this.appointmentController.deleteLogical.bind(this.appointmentController));
  }
}
