import { Application } from "express";
import { RecipeController } from "./recipe.controller";
import { authenticate, authorize } from "../../auth/access";

/** Rutas del feature Recipe. Modalidad 3 — JWT + RBAC en todas las operaciones. */
export class RecipeRoutes {
  public recipeController: RecipeController = new RecipeController();

  public routes(app: Application): void {
    app
      .route("/api/recetas")
      .get(this.recipeController.getAll.bind(this.recipeController));

    app
      .route("/api/recetas/:id")
      .get(this.recipeController.getOne.bind(this.recipeController));

    app
      .route("/api/recetas")
      .post(this.recipeController.create.bind(this.recipeController));

    app
      .route("/api/recetas/:id")
      .put(this.recipeController.updatePut.bind(this.recipeController))
      .patch(this.recipeController.updatePatch.bind(this.recipeController));

    app
      .route("/api/recetas/:id")
      .delete(this.recipeController.deletePhysical.bind(this.recipeController));

    app
      .route("/api/recetas/:id/deactivate")
      .patch(this.recipeController.deleteLogical.bind(this.recipeController));
  }
}
