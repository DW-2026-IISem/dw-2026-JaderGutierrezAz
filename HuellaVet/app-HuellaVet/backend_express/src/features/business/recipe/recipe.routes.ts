import { Application } from "express";
import { RecipeController } from "./recipe.controller";

export class RecipeRoutes {
  public recipeController: RecipeController = new RecipeController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================

    // getAll
    app
      .route("/api/recetas")
      .get(this.recipeController.getAll.bind(this.recipeController));

    // getOne
    app
      .route("/api/recetas/:id")
      .get(this.recipeController.getOne.bind(this.recipeController));

    // create
    app
      .route("/api/recetas")
      .post(this.recipeController.create.bind(this.recipeController));

    // update (PUT / PATCH)
    app
      .route("/api/recetas/:id")
      .put(this.recipeController.updatePut.bind(this.recipeController))
      .patch(this.recipeController.updatePatch.bind(this.recipeController));

    // delete físico
    app
      .route("/api/recetas/:id")
      .delete(this.recipeController.deletePhysical.bind(this.recipeController));

    // delete lógico
    app
      .route("/api/recetas/:id/deactivate")
      .patch(this.recipeController.deleteLogical.bind(this.recipeController));
  }
}
