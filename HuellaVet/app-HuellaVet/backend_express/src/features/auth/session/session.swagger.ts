import { bearerSecurity, openSecurity, unauthorizedResponse } from "../../../shared/http/swagger-security";

export const sessionSwagger = {
  tags: [{ name: "Sesión", description: "Login, renovación, cierre y perfil — OPEN + JWT" }],
  paths: {
    "/api/sesion/login": {
      post: {
        tags: ["Sesión"],
        summary: "Iniciar sesión (OPEN)",
        description:
          "Valida usuario/correo + contraseña y abre una sesión: emite access_token (JWT) y refresh_token " +
          "persistido como hash, con family_id nuevo. Respuesta idéntica para usuario inexistente y contraseña incorrecta.",
        security: openSecurity,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Login" } } },
        },
        responses: {
          "200": { description: "Par de tokens (access_token, refresh_token, expires_in)" },
          "400": { description: "Faltan identifier o password" },
          "401": { description: "Credenciales inválidas o usuario inactivo" },
        },
      },
    },
    "/api/sesion/refresh": {
      post: {
        tags: ["Sesión"],
        summary: "Renovar el access token (OPEN con credencial de sesión)",
        description:
          "Rota el refresh token: invalida el presentado y emite uno nuevo con el mismo family_id. " +
          "Un token ya rotado se interpreta como reutilización y revoca toda la familia (401).",
        security: openSecurity,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RefreshToken" } } },
        },
        responses: {
          "200": { description: "Par de tokens nuevo (access_token + refresh_token rotado)" },
          "400": { description: "Falta refresh_token" },
          "401": { description: "Token inválido, expirado o reutilizado (familia revocada)" },
        },
      },
    },
    "/api/sesion/logout": {
      post: {
        tags: ["Sesión"],
        summary: "Cerrar sesión (OPEN con credencial de sesión)",
        description:
          "Revoca el refresh token presentado. Idempotente. El access token sigue vigente hasta expirar.",
        security: openSecurity,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RefreshToken" } } },
        },
        responses: {
          "200": { description: "Sesión cerrada ({ message })" },
          "400": { description: "Falta refresh_token" },
        },
      },
    },
    "/api/sesion/perfil": {
      get: {
        tags: ["Sesión"],
        summary: "Perfil del usuario autenticado (JWT)",
        description: "authenticate valida el token y revalida en BD que el usuario sigue activo.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Perfil ({ user }) — nunca incluye password" },
          "401": unauthorizedResponse,
        },
      },
    },
    "/api/permisos": {
      get: {
        tags: ["Sesión"],
        summary: "Mis permisos efectivos (JWT)",
        description:
          "Ejecuta la misma consulta que authorize. Herramienta para depurar el RBAC: lo que aparece " +
          "aquí es exactamente lo que autoriza.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Permisos efectivos ({ permissions: [...] })" },
          "401": unauthorizedResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      Login: {
        type: "object",
        required: ["identifier", "password"],
        properties: {
          identifier: { type: "string", example: "admin", description: "username o email" },
          password: { type: "string", format: "password", example: "Admin123!" },
        },
      },
      RefreshToken: {
        type: "object",
        required: ["refresh_token"],
        properties: {
          refresh_token: { type: "string", example: "9f2c... (opaco, no es un JWT)" },
        },
      },
      SessionTokens: {
        type: "object",
        properties: {
          access_token: { type: "string", description: "JWT firmado (HS256), vida corta" },
          token_type: { type: "string", example: "Bearer" },
          expires_in: { type: "integer", example: 900 },
          refresh_token: { type: "string" },
          refresh_expires_in: { type: "integer", example: 604800 },
        },
      },
    },
  },
};
