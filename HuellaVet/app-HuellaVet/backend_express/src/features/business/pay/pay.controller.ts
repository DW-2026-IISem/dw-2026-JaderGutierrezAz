import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreatePayDto, UpdatePayDto, PatchPayDto } from "./dto";
import { PayService } from "./pay.service";

export class PayController extends BaseController {
  public constructor(private readonly service: PayService = new PayService()) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const pays = await this.service.getAll();
      res.status(200).json({ pays });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const pay = await this.service.getOne(this.paramId(req));
      res.status(200).json({ pay });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const pay = await this.service.create(req.body as CreatePayDto);
      res.status(201).json({ pay });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const pay = await this.service.updatePut(this.paramId(req), req.body as UpdatePayDto);
      res.status(200).json({ pay });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const pay = await this.service.updatePatch(this.paramId(req), req.body as PatchPayDto);
      res.status(200).json({ pay });
    });
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Pay permanently deleted", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const pay = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Pay cancelled (logical delete)", pay });
    });
  }
}
