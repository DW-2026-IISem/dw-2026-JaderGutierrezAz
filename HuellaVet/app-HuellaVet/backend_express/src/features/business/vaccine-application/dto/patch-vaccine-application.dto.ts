import { UpdateVaccineApplicationDto } from "./update-vaccine-application.dto";

/** Datos de entrada de `PATCH /api/aplicaciones-vacunas/:id` (actualización parcial). */
export type PatchVaccineApplicationDto = Partial<UpdateVaccineApplicationDto>;
