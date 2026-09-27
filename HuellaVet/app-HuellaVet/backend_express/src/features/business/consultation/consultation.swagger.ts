/**
 * Documentación OpenAPI del feature Consultation.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const consultationSwagger = {
  tags: [
    {
      name: "Consultas",
      description: "CRUD de consultas veterinarias — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/consultas": {
      get: {
        tags: ["Consultas"],
        summary: "Listar consultas activas",
        description: "SIN AUTH — retorna consultas con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de consultas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    consultations: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Consultation" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Consultas"],
        summary: "Crear consulta",
        description: "SIN AUTH — appointment_id debe existir y no estar cancelada",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ConsultationCreate" } } },
        },
        responses: {
          "201": {
            description: "Consulta creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    consultation: { $ref: "#/components/schemas/Consultation" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/consultas/{id}": {
      get: {
        tags: ["Consultas"],
        summary: "Obtener consulta por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Consulta encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    consultation: { $ref: "#/components/schemas/Consultation" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Consultas"],
        summary: "Actualizar consulta (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ConsultationUpdate" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Consultas"],
        summary: "Actualizar consulta (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ConsultationPatch" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Consultas"],
        summary: "Eliminar consulta (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/consultas/{id}/deactivate": {
      patch: {
        tags: ["Consultas"],
        summary: "Eliminar consulta (lógico)",
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
      Consultation: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          appointment_id: { type: "integer", example: 1 },
          name: { type: "string", example: "Consulta general" },
          description: { type: "string", example: "Revisión de peso", nullable: true },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      ConsultationCreate: {
        type: "object",
        required: ["appointment_id", "name"],
        properties: {
          appointment_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean", default: true },
        },
      },
      ConsultationUpdate: {
        type: "object",
        required: ["appointment_id", "name"],
        properties: {
          appointment_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
      ConsultationPatch: {
        type: "object",
        properties: {
          appointment_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
    },
  },
};
