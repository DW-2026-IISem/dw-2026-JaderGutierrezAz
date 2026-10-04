import { Application } from "express";
import { RecipeController } from "./recipe.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature Recipe. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class RecipeRoutes {
  public recipeController: RecipeController = new RecipeController();

  public routes(app: Application): void {
    app
      .route("/api/recetas")
      .get(authenticate, authorize, this.recipeController.getAll.bind(this.recipeController));

    app
      .route("/api/recetas/:id")
      .get(authenticate, authorize, this.recipeController.getOne.bind(this.recipeController));

    app
      .route("/api/recetas")
      .post(authenticate, authorize, this.recipeController.create.bind(this.recipeController));

    app
      .route("/api/recetas/:id")
      .put(authenticate, authorize, this.recipeController.updatePut.bind(this.recipeController))
      .patch(authenticate, authorize, this.recipeController.updatePatch.bind(this.recipeController));

    app
      .route("/api/recetas/:id")
      .delete(authenticate, authorize, this.recipeController.deletePhysical.bind(this.recipeController));

    app
      .route("/api/recetas/:id/deactivate")
      .patch(authenticate, authorize, this.recipeController.deleteLogical.bind(this.recipeController));
  }
}
