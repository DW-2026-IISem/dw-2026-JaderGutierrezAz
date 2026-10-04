/** PUT /api/recursos/:id. status no está aquí: solo cambia con el borrado lógico. */
export interface UpdateResourceDto {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description?: string | null;
}
