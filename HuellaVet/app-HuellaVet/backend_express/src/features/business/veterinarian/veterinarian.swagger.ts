/**
 * Documentación OpenAPI del feature Veterinarian.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const veterinarianSwagger = {
  tags: [
    {
      name: "Veterinarios",
      description: "CRUD de veterinarios — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/veterinarios": {
      get: {
        tags: ["Veterinarios"],
        summary: "Listar veterinarios activos",
        description: "SIN AUTH — retorna veterinarios con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de veterinarios",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    veterinarians: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Veterinarian" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Veterinarios"],
        summary: "Crear veterinario",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VeterinarianCreate" } } },
        },
        responses: {
          "201": {
            description: "Veterinario creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    veterinarian: { $ref: "#/components/schemas/Veterinarian" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/veterinarios/{id}": {
      get: {
        tags: ["Veterinarios"],
        summary: "Obtener veterinario por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Veterinario encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    veterinarian: { $ref: "#/components/schemas/Veterinarian" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Veterinarios"],
        summary: "Actualizar veterinario (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VeterinarianUpdate" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Veterinarios"],
        summary: "Actualizar veterinario (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VeterinarianPatch" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Veterinarios"],
        summary: "Eliminar veterinario (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/veterinarios/{id}/deactivate": {
      patch: {
        tags: ["Veterinarios"],
        summary: "Eliminar veterinario (lógico)",
        description: "SIN AUTH — is_active = false",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Veterinarian: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Dr. Camilo Rojas" },
          description: { type: "string", example: "Especialista en cirugía", nullable: true },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      VeterinarianCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean", default: true },
        },
      },
      VeterinarianUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
      VeterinarianPatch: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
    },
  },
};
