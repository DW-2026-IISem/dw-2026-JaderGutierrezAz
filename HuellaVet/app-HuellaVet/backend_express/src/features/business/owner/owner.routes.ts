import { Application } from "express";
import { OwnerController } from "./owner.controller";

export class OwnerRoutes {
  public ownerController: OwnerController = new OwnerController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================
    // (rellenar en el siguiente paso)
  }
}
