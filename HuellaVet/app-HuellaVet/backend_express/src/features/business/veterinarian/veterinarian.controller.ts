import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateVeterinarianDto, UpdateVeterinarianDto, PatchVeterinarianDto } from "./dto";
import { VeterinarianService } from "./veterinarian.service";

export class VeterinarianController extends BaseController {
  public constructor(
    private readonly service: VeterinarianService = new VeterinarianService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const veterinarians = await this.service.getAll();
      res.status(200).json({ veterinarians });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const veterinarian = await this.service.getOne(this.paramId(req));
      res.status(200).json({ veterinarian });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const veterinarian = await this.service.create(req.body as CreateVeterinarianDto);
      res.status(201).json({ veterinarian });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const veterinarian = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateVeterinarianDto
      );
      res.status(200).json({ veterinarian });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const veterinarian = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchVeterinarianDto
      );
      res.status(200).json({ veterinarian });
    });
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Veterinarian permanently deleted", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const veterinarian = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Veterinarian deactivated (logical delete)", veterinarian });
    });
  }
}
