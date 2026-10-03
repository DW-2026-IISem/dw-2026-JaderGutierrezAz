import { UpdateVaccineDto } from "./update-vaccine.dto";

/** Datos de entrada de `PATCH /api/vacunas/:id` (actualización parcial). */
export type PatchVaccineDto = Partial<UpdateVaccineDto>;
