import { User, UserI } from "../user.model";

/** Respuesta HTTP de un usuario. password NUNCA sale de la API. */
export type UserResponseDto = Omit<UserI, "password">;

export function toUserResponse(user: User): UserResponseDto {
  const { password, ...safe } = user.toJSON() as UserI & { password?: string };
  return safe;
}
