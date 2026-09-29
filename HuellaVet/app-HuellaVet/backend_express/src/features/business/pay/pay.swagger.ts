/**
 * Documentación OpenAPI del feature Pay.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 * reference_type / reference_id son una referencia polimórfica (hoy solo "appointment").
 */

export const paySwagger = {
  tags: [
    {
      name: "Pagos",
      description: "CRUD de pagos — **SIN AUTH** (sin middleware JWT). Referencia polimórfica vía reference_type/reference_id",
    },
  ],
  paths: {
    "/api/pagos": {
      get: {
        tags: ["Pagos"],
        summary: "Listar pagos no cancelados",
        description: "SIN AUTH — retorna pagos con state != cancelled",
        security: [],
        responses: {
          "200": {
            description: "Lista de pagos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pays: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Pay" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Pagos"],
        summary: "Crear pago",
        description: "SIN AUTH — reference_type debe ser soportado y reference_id debe existir",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/PayCreate" } } },
        },
        responses: {
          "201": {
            description: "Pago creado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pay: { $ref: "#/components/schemas/Pay" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/pagos/{id}": {
      get: {
        tags: ["Pagos"],
        summary: "Obtener pago por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Pago encontrado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pay: { $ref: "#/components/schemas/Pay" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Pagos"],
        summary: "Actualizar pago (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/PayUpdate" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Pagos"],
        summary: "Actualizar pago (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/PayPatch" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Pagos"],
        summary: "Eliminar pago (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/pagos/{id}/deactivate": {
      patch: {
        tags: ["Pagos"],
        summary: "Cancelar pago (lógico)",
        description: "SIN AUTH — state = cancelled",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Cancelado" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Pay: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          reference_type: { type: "string", enum: ["appointment"], example: "appointment" },
          reference_id: { type: "integer", example: 1 },
          method: { type: "string", example: "Efectivo" },
          amount: { type: "number", format: "float", example: 85000.0 },
          date: { type: "string", format: "date-time" },
          state: { type: "string", enum: ["pending", "paid", "cancelled"], example: "pending" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PayCreate: {
        type: "object",
        required: ["reference_type", "reference_id", "method", "amount", "date"],
        properties: {
          reference_type: { type: "string", enum: ["appointment"] },
          reference_id: { type: "integer" },
          method: { type: "string" },
          amount: { type: "number", format: "float" },
          date: { type: "string", format: "date-time" },
          state: { type: "string", enum: ["pending", "paid", "cancelled"], default: "pending" },
        },
      },
      PayUpdate: {
        type: "object",
        required: ["reference_type", "reference_id", "method", "amount", "date"],
        properties: {
          reference_type: { type: "string", enum: ["appointment"] },
          reference_id: { type: "integer" },
          method: { type: "string" },
          amount: { type: "number", format: "float" },
          date: { type: "string", format: "date-time" },
          state: { type: "string", enum: ["pending", "paid", "cancelled"] },
        },
      },
      PayPatch: {
        type: "object",
        properties: {
          reference_type: { type: "string", enum: ["appointment"] },
          reference_id: { type: "integer" },
          method: { type: "string" },
          amount: { type: "number", format: "float" },
          date: { type: "string", format: "date-time" },
          state: { type: "string", enum: ["pending", "paid", "cancelled"] },
        },
      },
    },
  },
};
