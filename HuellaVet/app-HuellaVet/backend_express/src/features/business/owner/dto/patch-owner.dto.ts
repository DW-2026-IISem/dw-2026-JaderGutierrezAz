import { UpdateOwnerDto } from "./update-owner.dto";

/** Datos de entrada de `PATCH /api/propietarios/:id` (actualización parcial). */
export type PatchOwnerDto = Partial<UpdateOwnerDto>;
