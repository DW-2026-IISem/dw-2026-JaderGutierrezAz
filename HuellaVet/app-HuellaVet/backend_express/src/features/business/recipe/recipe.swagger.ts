/**
 * Documentación OpenAPI del feature Recipe.
 * Se agrega desde `src/swagger` (registry externo), no se monta aquí.
 *
 * Leyenda: endpoints documentados como SIN AUTH (sin middleware JWT).
 */

export const recipeSwagger = {
  tags: [
    {
      name: "Recetas",
      description: "CRUD de recetas médicas — **SIN AUTH** (sin middleware JWT)",
    },
  ],
  paths: {
    "/api/recetas": {
      get: {
        tags: ["Recetas"],
        summary: "Listar recetas activas",
        description: "SIN AUTH — retorna recetas con is_active=true",
        security: [],
        responses: {
          "200": {
            description: "Lista de recetas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    recipes: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Recipe" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Recetas"],
        summary: "Crear receta",
        description: "SIN AUTH — consultation_id debe existir y estar activa",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RecipeCreate" } } },
        },
        responses: {
          "201": {
            description: "Receta creada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    recipe: { $ref: "#/components/schemas/Recipe" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/recetas/{id}": {
      get: {
        tags: ["Recetas"],
        summary: "Obtener receta por id",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": {
            description: "Receta encontrada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    recipe: { $ref: "#/components/schemas/Recipe" },
                  },
                },
              },
            },
          },
          "404": { description: "No encontrado" },
        },
      },
      put: {
        tags: ["Recetas"],
        summary: "Actualizar receta (PUT — reemplazo)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RecipeUpdate" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      patch: {
        tags: ["Recetas"],
        summary: "Actualizar receta (PATCH — parcial)",
        description: "SIN AUTH",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RecipePatch" } } },
        },
        responses: {
          "200": { description: "Actualizado" },
          "404": { description: "No encontrado" },
        },
      },
      delete: {
        tags: ["Recetas"],
        summary: "Eliminar receta (físico)",
        description: "SIN AUTH — borra la fila",
        security: [],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
        responses: {
          "200": { description: "Eliminado" },
          "404": { description: "No encontrado" },
        },
      },
    },
    "/api/recetas/{id}/deactivate": {
      patch: {
        tags: ["Recetas"],
        summary: "Eliminar receta (lógico)",
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
      Recipe: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          consultation_id: { type: "integer", example: 1 },
          name: { type: "string", example: "Antiinflamatorio" },
          description: { type: "string", example: "Una tableta cada 12 horas", nullable: true },
          is_active: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      RecipeCreate: {
        type: "object",
        required: ["consultation_id", "name"],
        properties: {
          consultation_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean", default: true },
        },
      },
      RecipeUpdate: {
        type: "object",
        required: ["consultation_id", "name"],
        properties: {
          consultation_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
      RecipePatch: {
        type: "object",
        properties: {
          consultation_id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string" },
          is_active: { type: "boolean" },
        },
      },
    },
  },
};
