/**
 * Documentación OpenAPI del feature Pet.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const petSwagger = {
  tags: [
    {
      name: "Mascotas",
      description: "CRUD de mascotas — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/mascotas": {
      get: {
        tags: ["Mascotas"],
        summary: "Listar mascotas activas",
        description: "SIN AUTH — retorna mascotas con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de mascotas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pets: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Pet" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Mascotas"],
        summary: "Crear mascota",
        description: "SIN AUTH — owner_id debe existir y estar activo",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PetCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Mascota creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pet: { $ref: "#/components/schemas/Pet" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/mascotas/{id}": {
      get: {
        tags: ["Mascotas"],
        summary: "Obtener mascota por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Mascota encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pet: { $ref: "#/components/schemas/Pet" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Mascotas"],
        summary: "Actualizar mascota (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/PetUpdate" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Mascotas"],
        summary: "Actualizar mascota (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/PetPatch" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Mascotas"],
        summary: "Eliminar mascota (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/mascotas/{id}/deactivate": {
      patch: {
        tags: ["Mascotas"],
        summary: "Eliminar mascota (lógico)",
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
      Pet: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          owner_id: { type: "integer", example: 1 },
          name: { type: "string", example: "Firulais" },
          description: { type: "string", example: "Labrador color dorado", nullable: true },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PetCreate: {
        type: "object",
        required: ["owner_id", "name"],
        properties: {
          owner_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean", default: true },
        },
      },
      PetUpdate: {
        type: "object",
        required: ["owner_id", "name"],
        properties: {
          owner_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
      PetPatch: {
        type: "object",
        properties: {
          owner_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
    },
  },
};
