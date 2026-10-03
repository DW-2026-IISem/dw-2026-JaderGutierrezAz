/** Datos de entrada de POST /api/usuarios. status es opcional, default "active". */
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  avatar?: string | null;
  status?: "active" | "inactive";
}
