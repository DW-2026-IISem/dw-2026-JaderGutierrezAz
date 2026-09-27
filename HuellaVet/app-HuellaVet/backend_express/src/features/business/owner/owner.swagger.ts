/**
 * Documentación OpenAPI del feature Owner.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const ownerSwagger = {
  tags: [
    {
      name: "Propietarios",
      description: "CRUD de propietarios de mascotas — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/propietarios": {
      get: {
        tags: ["Propietarios"],
        summary: "Listar propietarios activos",
        description: "SIN AUTH — retorna propietarios con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de propietarios",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    owners: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Owner" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Propietarios"],
        summary: "Crear propietario",
        description: "SIN AUTH",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OwnerCreate" },
            },
          },
        },
        responses: {
          "201": {
            description: "Propietario creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    owner: { $ref: "#/components/schemas/Owner" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/propietarios/{id}": {
      get: {
        tags: ["Propietarios"],
        summary: "Obtener propietario por id",
        description: "SIN AUTH",
        security: [],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": {
            description: "Propietario encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    owner: { $ref: "#/components/schemas/Owner" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Propietarios"],
        summary: "Actualizar propietario (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OwnerUpdate" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Propietarios"],
        summary: "Actualizar propietario (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/OwnerPatch" },
            },
          },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Propietarios"],
        summary: "Eliminar propietario (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/propietarios/{id}/deactivate": {
      patch: {
        tags: ["Propietarios"],
        summary: "Eliminar propietario (lógico)",
        description: "SIN AUTH — is_active = false",
        security: [],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer" } },
        ],
        responses: {
          "200": { description: "Desactivado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Owner: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          document_type: { type: "string", example: "CC" },
          document_number: { type: "string", example: "1122334455" },
          name: { type: "string", example: "Ana Pérez" },
          phone: { type: "string", example: "3001234567" },
          email: { type: "string", format: "email", example: "ana@example.com" },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      OwnerCreate: {
        type: "object",
        required: ["document_type", "document_number", "name"],
        properties: {
          document_type: { type: "string" },
          document_number: { type: "string" },
          name: { type: "string" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          is_active: { type: "boolean", default: true },
        },
      },
      OwnerUpdate: {
        type: "object",
        required: ["document_type", "document_number", "name"],
        properties: {
          document_type: { type: "string" },
          document_number: { type: "string" },
          name: { type: "string" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          is_active: { type: "boolean" },
        },
      },
      OwnerPatch: {
        type: "object",
        properties: {
          document_type: { type: "string" },
          document_number: { type: "string" },
          name: { type: "string" },
          phone: { type: "string" },
          email: { type: "string", format: "email" },
          is_active: { type: "boolean" },
        },
      },
    },
  },
};
