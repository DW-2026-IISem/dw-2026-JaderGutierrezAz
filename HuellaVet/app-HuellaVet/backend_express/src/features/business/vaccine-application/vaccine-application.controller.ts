import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import {
  CreateVaccineApplicationDto,
  UpdateVaccineApplicationDto,
  PatchVaccineApplicationDto,
} from "./dto";
import { VaccineApplicationService } from "./vaccine-application.service";

export class VaccineApplicationController extends BaseController {
  public constructor(
    private readonly service: VaccineApplicationService = new VaccineApplicationService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccineApplications = await this.service.getAll();
      res.status(200).json({ vaccineApplications });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccineApplication = await this.service.getOne(this.paramId(req));
      res.status(200).json({ vaccineApplication });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccineApplication = await this.service.create(req.body as CreateVaccineApplicationDto);
      res.status(201).json({ vaccineApplication });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccineApplication = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateVaccineApplicationDto
      );
      res.status(200).json({ vaccineApplication });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccineApplication = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchVaccineApplicationDto
      );
      res.status(200).json({ vaccineApplication });
    });
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Vaccine application permanently deleted", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const vaccineApplication = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({
        message: "Vaccine application deactivated (logical delete)",
        vaccineApplication,
      });
    });
  }
}
