import {
  bearerSecurity,
  forbiddenResponse,
  invalidIdResponse,
  notFoundResponse,
  unauthorizedResponse,
} from "../../../shared/http/swagger-security";

export const usersSwagger = {
  tags: [
    {
      name: "Usuarios",
      description: "CRUD de identidades + cambio de contraseña — JWT + RBAC",
    },
  ],
  paths: {
    "/api/usuarios": {
      get: {
        tags: ["Usuarios"],
        summary: "Listar usuarios activos",
        description: "JWT + RBAC. Nunca devuelve password.",
        security: bearerSecurity,
        responses: {
          "200": { description: "Lista de usuarios ({ users: [...] })" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
        },
      },
      post: {
        tags: ["Usuarios"],
        summary: "Crear usuario",
        description: "JWT + RBAC. password se hashea (bcrypt, 12 rondas).",
        security: bearerSecurity,
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UserCreate" } } },
        },
        responses: {
          "201": { description: "Usuario creado ({ user })" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "409": { description: "username o email ya en uso" },
        },
      },
    },
    "/api/usuarios/{id}": {
      get: {
        tags: ["Usuarios"],
        summary: "Obtener usuario por id",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Usuario ({ user })" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
      put: {
        tags: ["Usuarios"],
        summary: "Reemplazar usuario (PUT)",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UserUpdate" } } },
        },
        responses: {
          "200": { description: "Usuario actualizado ({ user })" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
          "409": { description: "username o email ya en uso" },
        },
      },
      patch: {
        tags: ["Usuarios"],
        summary: "Modificar usuario (PATCH)",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          content: { "application/json": { schema: { $ref: "#/components/schemas/UserPatch" } } },
        },
        responses: {
          "200": { description: "Usuario actualizado ({ user })" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
      delete: {
        tags: ["Usuarios"],
        summary: "Eliminar usuario (físico)",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado ({ message, id })" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/usuarios/{id}/deactivate": {
      patch: {
        tags: ["Usuarios"],
        summary: "Desactivar usuario (borrado lógico)",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado ({ message, user })" },
          "400": invalidIdResponse,
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
    "/api/usuarios/{id}/password": {
      patch: {
        tags: ["Usuarios"],
        summary: "Cambiar contraseña",
        description: "JWT + RBAC. Exige current_password.",
        security: bearerSecurity,
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ChangePassword" } } },
        },
        responses: {
          "200": { description: "Contraseña actualizada ({ message, id })" },
          "400": { description: "Faltan campos o current_password incorrecta" },
          "401": unauthorizedResponse,
          "403": forbiddenResponse,
          "404": notFoundResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          username: { type: "string", example: "admin" },
          email: { type: "string", format: "email", example: "admin@huellavet.local" },
          avatar: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], example: "active" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      UserCreate: {
        type: "object",
        required: ["username", "email", "password"],
        properties: {
          username: { type: "string", minLength: 3, maxLength: 80 },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password", minLength: 8 },
          avatar: { type: "string", nullable: true },
          status: { type: "string", enum: ["active", "inactive"], default: "active" },
        },
      },
      UserUpdate: {
        type: "object",
        required: ["username", "email"],
        properties: {
          username: { type: "string" },
          email: { type: "string", format: "email" },
          avatar: { type: "string", nullable: true },
        },
      },
      UserPatch: {
        type: "object",
        properties: {
          username: { type: "string" },
          email: { type: "string", format: "email" },
          avatar: { type: "string", nullable: true },
        },
      },
      ChangePassword: {
        type: "object",
        required: ["current_password", "new_password"],
        properties: {
          current_password: { type: "string", format: "password" },
          new_password: { type: "string", format: "password", minLength: 8 },
        },
      },
    },
  },
};
