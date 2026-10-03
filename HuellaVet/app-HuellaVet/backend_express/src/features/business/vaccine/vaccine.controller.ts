import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateVaccineDto, UpdateVaccineDto, PatchVaccineDto } from "./dto";
import { VaccineService } from "./vaccine.service";

export class VaccineController extends BaseController {
  public constructor(private readonly service: VaccineService = new VaccineService()) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccines = await this.service.getAll();
      res.status(200).json({ vaccines });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccine = await this.service.getOne(this.paramId(req));
      res.status(200).json({ vaccine });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccine = await this.service.create(req.body as CreateVaccineDto);
      res.status(201).json({ vaccine });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccine = await this.service.updatePut(this.paramId(req), req.body as UpdateVaccineDto);
      res.status(200).json({ vaccine });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccine = await this.service.updatePatch(this.paramId(req), req.body as PatchVaccineDto);
      res.status(200).json({ vaccine });
    });
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Vaccine permanently deleted", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccine = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Vaccine deactivated (logical delete)", vaccine });
    });
  }
}
