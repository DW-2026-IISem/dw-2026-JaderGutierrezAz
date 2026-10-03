import { UpdateVeterinarianDto } from "./update-veterinarian.dto";

/** Datos de entrada de `PATCH /api/veterinarios/:id` (actualización parcial). */
export type PatchVeterinarianDto = Partial<UpdateVeterinarianDto>;
