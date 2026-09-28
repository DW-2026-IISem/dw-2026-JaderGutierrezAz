/**
 * Documentación OpenAPI del feature Vaccine.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const vaccineSwagger = {
  tags: [
    {
      name: "Vacunas",
      description: "CRUD de vacunas — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/vacunas": {
      get: {
        tags: ["Vacunas"],
        summary: "Listar vacunas activas",
        description: "SIN AUTH — retorna vacunas con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de vacunas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vaccines: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Vaccine" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Vacunas"],
        summary: "Crear vacuna",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VaccineCreate" } } },
        },
        responses: {
          "201": {
            description: "Vacuna creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vaccine: { $ref: "#/components/schemas/Vaccine" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/vacunas/{id}": {
      get: {
        tags: ["Vacunas"],
        summary: "Obtener vacuna por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Vacuna encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vaccine: { $ref: "#/components/schemas/Vaccine" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Vacunas"],
        summary: "Actualizar vacuna (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VaccineUpdate" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Vacunas"],
        summary: "Actualizar vacuna (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/VaccinePatch" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Vacunas"],
        summary: "Eliminar vacuna (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/vacunas/{id}/deactivate": {
      patch: {
        tags: ["Vacunas"],
        summary: "Eliminar vacuna (lógico)",
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
      Vaccine: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Antirrábica" },
          description: { type: "string", example: "Vacuna anual", nullable: true },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      VaccineCreate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean", default: true },
        },
      },
      VaccineUpdate: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
      VaccinePatch: {
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
