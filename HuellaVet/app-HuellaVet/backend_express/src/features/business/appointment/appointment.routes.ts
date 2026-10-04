import { Application } from "express";
import { AppointmentController } from "./appointment.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature Appointment. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class AppointmentRoutes {
  public appointmentController: AppointmentController = new AppointmentController();

  public routes(app: Application): void {
    app
      .route("/api/citas")
      .get(authenticate, authorize, this.appointmentController.getAll.bind(this.appointmentController));

    app
      .route("/api/citas/:id")
      .get(authenticate, authorize, this.appointmentController.getOne.bind(this.appointmentController));

    app
      .route("/api/citas")
      .post(authenticate, authorize, this.appointmentController.create.bind(this.appointmentController));

    app
      .route("/api/citas/:id")
      .put(authenticate, authorize, this.appointmentController.updatePut.bind(this.appointmentController))
      .patch(
        authenticate,
        authorize,
        this.appointmentController.updatePatch.bind(this.appointmentController)
      );

    app
      .route("/api/citas/:id")
      .delete(
        authenticate,
        authorize,
        this.appointmentController.deletePhysical.bind(this.appointmentController)
      );

    app
      .route("/api/citas/:id/deactivate")
      .patch(
        authenticate,
        authorize,
        this.appointmentController.deleteLogical.bind(this.appointmentController)
      );
  }
}
