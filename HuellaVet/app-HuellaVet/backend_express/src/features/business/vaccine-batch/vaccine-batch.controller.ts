import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateVaccineBatchDto, UpdateVaccineBatchDto, PatchVaccineBatchDto } from "./dto";
import { VaccineBatchService } from "./vaccine-batch.service";

export class VaccineBatchController extends BaseController {
  public constructor(
    private readonly service: VaccineBatchService = new VaccineBatchService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccineBatches = await this.service.getAll();
      res.status(200).json({ vaccineBatches });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccineBatch = await this.service.getOne(this.paramId(req));
      res.status(200).json({ vaccineBatch });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccineBatch = await this.service.create(req.body as CreateVaccineBatchDto);
      res.status(201).json({ vaccineBatch });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccineBatch = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateVaccineBatchDto
      );
      res.status(200).json({ vaccineBatch });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccineBatch = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchVaccineBatchDto
      );
      res.status(200).json({ vaccineBatch });
    });
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Vaccine batch permanently deleted", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccineBatch = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Vaccine batch deactivated (logical delete)", vaccineBatch });
    });
  }
}
