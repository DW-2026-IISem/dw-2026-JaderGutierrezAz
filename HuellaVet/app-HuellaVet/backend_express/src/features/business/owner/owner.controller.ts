import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateOwnerDto, UpdateOwnerDto, PatchOwnerDto } from "./dto";
import { OwnerService } from "./owner.service";

export class OwnerController extends BaseController {
  public constructor(private readonly service: OwnerService = new OwnerService()) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const owners = await this.service.getAll();
      res.status(200).json({ owners });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const owner = await this.service.getOne(this.paramId(req));
      res.status(200).json({ owner });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const owner = await this.service.create(req.body as CreateOwnerDto);
      res.status(201).json({ owner });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const owner = await this.service.updatePut(this.paramId(req), req.body as UpdateOwnerDto);
      res.status(200).json({ owner });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const owner = await this.service.updatePatch(this.paramId(req), req.body as PatchOwnerDto);
      res.status(200).json({ owner });
    });
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Owner permanently deleted", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const owner = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Owner deactivated (logical delete)", owner });
    });
  }
}
