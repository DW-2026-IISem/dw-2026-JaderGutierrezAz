/**
 * Documentación OpenAPI del feature VaccineBatch.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const vaccineBatchSwagger = {
  tags: [
    {
      name: "Lotes de vacunas",
      description: "CRUD de lotes de vacunas — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/lotes-vacunas": {
      get: {
        tags: ["Lotes de vacunas"],
        summary: "Listar lotes activos",
        description: "SIN AUTH — retorna lotes con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de lotes",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vaccineBatches: {
                      type: "array",
                      items: { $ref: "#/components/schemas/VaccineBatch" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Lotes de vacunas"],
        summary: "Crear lote",
        description: "SIN AUTH — vaccine_id debe existir y estar activa",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VaccineBatchCreate" } } },
        },
        responses: {
          "201": {
            description: "Lote creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vaccineBatch: { $ref: "#/components/schemas/VaccineBatch" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/lotes-vacunas/{id}": {
      get: {
        tags: ["Lotes de vacunas"],
        summary: "Obtener lote por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Lote encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vaccineBatch: { $ref: "#/components/schemas/VaccineBatch" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Lotes de vacunas"],
        summary: "Actualizar lote (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VaccineBatchUpdate" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Lotes de vacunas"],
        summary: "Actualizar lote (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VaccineBatchPatch" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Lotes de vacunas"],
        summary: "Eliminar lote (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/lotes-vacunas/{id}/deactivate": {
      patch: {
        tags: ["Lotes de vacunas"],
        summary: "Eliminar lote (lógico)",
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
      VaccineBatch: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          vaccine_id: { type: "integer", example: 1 },
          name: { type: "string", example: "Lote A-2026-001" },
          description: { type: "string", example: "Lote recibido en septiembre", nullable: true },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      VaccineBatchCreate: {
        type: "object",
        required: ["vaccine_id", "name"],
        properties: {
          vaccine_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean", default: true },
        },
      },
      VaccineBatchUpdate: {
        type: "object",
        required: ["vaccine_id", "name"],
        properties: {
          vaccine_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
      VaccineBatchPatch: {
        type: "object",
        properties: {
          vaccine_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
    },
  },
};
