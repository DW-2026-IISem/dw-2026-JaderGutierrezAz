/**
 * Documentación OpenAPI del feature Appointment.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const appointmentSwagger = {
  tags: [
    {
      name: "Citas",
      description: "CRUD de citas veterinarias — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/citas": {
      get: {
        tags: ["Citas"],
        summary: "Listar citas no canceladas",
        description: "SIN AUTH — retorna citas con state != cancelled",
        security: [],
        responses: {
          "200": {
            description: "Lista de citas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    appointments: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Appointment" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Citas"],
        summary: "Crear cita",
        description: "SIN AUTH — pet_id y veterinarian_id deben existir y estar activos",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AppointmentCreate" } } },
        },
        responses: {
          "201": {
            description: "Cita creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    appointment: { $ref: "#/components/schemas/Appointment" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/citas/{id}": {
      get: {
        tags: ["Citas"],
        summary: "Obtener cita por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Cita encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    appointment: { $ref: "#/components/schemas/Appointment" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Citas"],
        summary: "Actualizar cita (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AppointmentUpdate" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Citas"],
        summary: "Actualizar cita (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AppointmentPatch" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Citas"],
        summary: "Eliminar cita (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/citas/{id}/deactivate": {
      patch: {
        tags: ["Citas"],
        summary: "Cancelar cita (lógico)",
        description: "SIN AUTH — state = cancelled",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Cancelada" },
          "404": { description: "No encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      Appointment: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          pet_id: { type: "integer", example: 1 },
          veterinarian_id: { type: "integer", example: 1 },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          reason: { type: "string", example: "Control anual" },
          state: { type: "string", enum: ["scheduled", "completed", "cancelled"], example: "scheduled" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      AppointmentCreate: {
        type: "object",
        required: ["pet_id", "veterinarian_id", "start_date", "end_date", "reason"],
        properties: {
          pet_id: { type: "integer" },
          veterinarian_id: { type: "integer" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          reason: { type: "string" },
          state: { type: "string", enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
        },
      },
      AppointmentUpdate: {
        type: "object",
        required: ["pet_id", "veterinarian_id", "start_date", "end_date", "reason"],
        properties: {
          pet_id: { type: "integer" },
          veterinarian_id: { type: "integer" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          reason: { type: "string" },
          state: { type: "string", enum: ["scheduled", "completed", "cancelled"] },
        },
      },
      AppointmentPatch: {
        type: "object",
        properties: {
          pet_id: { type: "integer" },
          veterinarian_id: { type: "integer" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          reason: { type: "string" },
          state: { type: "string", enum: ["scheduled", "completed", "cancelled"] },
        },
      },
    },
  },
};
