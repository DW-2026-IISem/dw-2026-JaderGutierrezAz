import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateRecipeDto, UpdateRecipeDto, PatchRecipeDto } from "./dto";
import { RecipeService } from "./recipe.service";

export class RecipeController extends BaseController {
  public constructor(private readonly service: RecipeService = new RecipeService()) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const recipes = await this.service.getAll();
      res.status(200).json({ recipes });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const recipe = await this.service.getOne(this.paramId(req));
      res.status(200).json({ recipe });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const recipe = await this.service.create(req.body as CreateRecipeDto);
      res.status(201).json({ recipe });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const recipe = await this.service.updatePut(this.paramId(req), req.body as UpdateRecipeDto);
      res.status(200).json({ recipe });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const recipe = await this.service.updatePatch(this.paramId(req), req.body as PatchRecipeDto);
      res.status(200).json({ recipe });
    });
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Recipe permanently deleted", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const recipe = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Recipe deactivated (logical delete)", recipe });
    });
  }
}
