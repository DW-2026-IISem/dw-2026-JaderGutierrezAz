import { UpdateConsultationDto } from "./update-consultation.dto";

/** Datos de entrada de `PATCH /api/consultas/:id` (actualización parcial). */
export type PatchConsultationDto = Partial<UpdateConsultationDto>;
