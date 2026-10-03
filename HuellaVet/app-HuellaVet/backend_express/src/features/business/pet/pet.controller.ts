import { Request, Response } from "express";
import { BaseController } from "../../../shared/http/base-controller";
import { CreatePetDto, UpdatePetDto, PatchPetDto } from "./dto";
import { PetService } from "./pet.service";

export class PetController extends BaseController {
  public constructor(private readonly service: PetService = new PetService()) {
    super();
  }

  // ================== READ ==================
  public async getAll(_req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const pets = await this.service.getAll();
      res.status(200).json({ pets });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const pet = await this.service.getOne(this.paramId(req));
      res.status(200).json({ pet });
    });
  }

  // ================== CREATE ==================
  public async create(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const pet = await this.service.create(req.body as CreatePetDto);
      res.status(201).json({ pet });
    });
  }

  // ================== UPDATE ==================
  public async updatePut(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const pet = await this.service.updatePut(this.paramId(req), req.body as UpdatePetDto);
      res.status(200).json({ pet });
    });
  }

  public async updatePatch(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const pet = await this.service.updatePatch(this.paramId(req), req.body as PatchPetDto);
      res.status(200).json({ pet });
    });
  }

  // ================== DELETE ==================
  public async deletePhysical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const id = this.paramId(req);
      await this.service.deletePhysical(id);
      res.status(200).json({ message: "Pet permanently deleted", id });
    });
  }

  public async deleteLogical(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const pet = await this.service.deleteLogical(this.paramId(req));
      res.status(200).json({ message: "Pet deactivated (logical delete)", pet });
    });
  }
}
