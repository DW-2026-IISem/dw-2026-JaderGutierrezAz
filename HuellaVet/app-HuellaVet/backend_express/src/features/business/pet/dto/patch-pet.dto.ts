import { UpdatePetDto } from "./update-pet.dto";

/** Datos de entrada de `PATCH /api/mascotas/:id` (actualización parcial). */
export type PatchPetDto = Partial<UpdatePetDto>;
