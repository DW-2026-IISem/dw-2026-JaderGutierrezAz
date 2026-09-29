/**
 * Documentación OpenAPI del feature VaccineApplication.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const vaccineApplicationSwagger = {
  tags: [
    {
      name: "Aplicaciones de vacunas",
      description: "CRUD de aplicaciones de vacunas — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/aplicaciones-vacunas": {
      get: {
        tags: ["Aplicaciones de vacunas"],
        summary: "Listar aplicaciones activas",
        description: "SIN AUTH — retorna aplicaciones con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de aplicaciones",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vaccineApplications: {
                      type: "array",
                      items: { $ref: "#/components/schemas/VaccineApplication" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Aplicaciones de vacunas"],
        summary: "Crear aplicación",
        description: "SIN AUTH — consultation_id y vaccine_batch_id deben existir y estar activos",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VaccineApplicationCreate" } } },
        },
        responses: {
          "201": {
            description: "Aplicación creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vaccineApplication: { $ref: "#/components/schemas/VaccineApplication" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/aplicaciones-vacunas/{id}": {
      get: {
        tags: ["Aplicaciones de vacunas"],
        summary: "Obtener aplicación por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Aplicación encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vaccineApplication: { $ref: "#/components/schemas/VaccineApplication" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Aplicaciones de vacunas"],
        summary: "Actualizar aplicación (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VaccineApplicationUpdate" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Aplicaciones de vacunas"],
        summary: "Actualizar aplicación (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VaccineApplicationPatch" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Aplicaciones de vacunas"],
        summary: "Eliminar aplicación (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/aplicaciones-vacunas/{id}/deactivate": {
      patch: {
        tags: ["Aplicaciones de vacunas"],
        summary: "Eliminar aplicación (lógico)",
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
      VaccineApplication: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          consultation_id: { type: "integer", example: 1 },
          vaccine_batch_id: { type: "integer", example: 1 },
          name: { type: "string", example: "Aplicación antirrábica" },
          description: { type: "string", example: "Dosis anual", nullable: true },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      VaccineApplicationCreate: {
        type: "object",
        required: ["consultation_id", "vaccine_batch_id", "name"],
        properties: {
          consultation_id: { type: "integer" },
          vaccine_batch_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean", default: true },
        },
      },
      VaccineApplicationUpdate: {
        type: "object",
        required: ["consultation_id", "vaccine_batch_id", "name"],
        properties: {
          consultation_id: { type: "integer" },
          vaccine_batch_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
      VaccineApplicationPatch: {
        type: "object",
        properties: {
          consultation_id: { type: "integer" },
          vaccine_batch_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
    },
  },
};
