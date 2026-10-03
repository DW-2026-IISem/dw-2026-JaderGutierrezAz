import { UpdateVaccineBatchDto } from "./update-vaccine-batch.dto";

/** Datos de entrada de `PATCH /api/lotes-vacunas/:id` (actualización parcial). */
export type PatchVaccineBatchDto = Partial<UpdateVaccineBatchDto>;
