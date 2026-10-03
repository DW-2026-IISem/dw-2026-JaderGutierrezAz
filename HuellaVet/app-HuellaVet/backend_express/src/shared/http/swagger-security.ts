/**
 * Piezas reutilizables de OpenAPI para las modalidades de acceso.
 * Hoy (Fase I) todo es OPEN; esto se activa cuando las rutas pasen a JWT/RBAC.
 */

export const bearerSecurityScheme = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Access token JWT. Enviar como Authorization: Bearer <access_token>.",
  },
};

export const openSecurity: unknown[] = [];
export const bearerSecurity = [{ bearerAuth: [] }];

export const unauthorizedResponse = {
  description: "401 No autenticado — falta el Bearer token, es inválido/expiró o el usuario está inactivo",
};

export const forbiddenResponse = {
  description: "403 Prohibido — autenticado, pero sin concesión activa para esta operación (deny by default)",
};

export const invalidIdResponse = {
  description: "400 id inválido (debe ser un entero positivo)",
};

export const notFoundResponse = {
  description: "404 No encontrado",
};
