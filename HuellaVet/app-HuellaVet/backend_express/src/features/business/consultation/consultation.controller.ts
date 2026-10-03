import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateConsultationDto, UpdateConsultationDto, PatchConsultationDto } from "./dto";
import { ConsultationService } from "./consultation.service";

export class ConsultationController extends BaseController {
  public constructor(
    private readonly service: ConsultationService = new ConsultationService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const consultations = await this.service.getAll();
      res.status(200).json({ consultations });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const consultation = await this.service.getOne(this.paramId(req));
      res.status(200).json({ consultation });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const consultation = await this.service.create(req.body as CreateConsultationDto);
      res.status(201).json({ consultation });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const consultation = await this.service.updatePut(
        this.paramId(req),
        req.body as UpdateConsultationDto
      );
      res.status(200).json({ consultation });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const consultation = await this.service.updatePatch(
        this.paramId(req),
        req.body as PatchConsultationDto
      );
      res.status(200).json({ consultation });
    });
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Consultation permanently deleted", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const consultation = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Consultation deactivated (logical delete)", consultation });
    });
  }
}
