import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import { ownerSwagger } from "../features/business/owner/owner.swagger";
import { petSwagger } from "../features/business/pet/pet.swagger";
import { veterinarianSwagger } from "../features/business/veterinarian/veterinarian.swagger";
import { appointmentSwagger } from "../features/business/appointment/appointment.swagger";
import { consultationSwagger } from "../features/business/consultation/consultation.swagger";
import { vaccineSwagger } from "../features/business/vaccine/vaccine.swagger";
import { vaccineBatchSwagger } from "../features/business/vaccine-batch/vaccine-batch.swagger";
import { recipeSwagger } from "../features/business/recipe/recipe.swagger";
import { vaccineApplicationSwagger } from "../features/business/vaccine-application/vaccine-application.swagger";
import { paySwagger } from "../features/business/pay/pay.swagger";

export type FeatureSwaggerModule = {
  tags: unknown[];
  paths: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
};

const featureSwaggerModules: FeatureSwaggerModule[] = [
  ownerSwagger,
  petSwagger,
  veterinarianSwagger,
  appointmentSwagger,
  consultationSwagger,
  vaccineSwagger,
  vaccineBatchSwagger,
  recipeSwagger,
  vaccineApplicationSwagger,
  paySwagger,
];

export function buildOpenApiDocument() {
  const tags: unknown[] = [];
  const paths: Record<string, unknown> = {};
  const schemas: Record<string, unknown> = {};

  for (const mod of featureSwaggerModules) {
    tags.push(...mod.tags);
    Object.assign(paths, mod.paths);
    if (mod.components?.schemas) {
      Object.assign(schemas, mod.components.schemas);
    }
  }

  return {
    openapi: "3.0.3",
    info: {
      title: "HuellaVet API",
      version: "1.0.0",
      description:
        "API HuellaVet (Express + Sequelize). Todas las rutas business son **SIN AUTH** en este lab.",
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 4000}`, description: "Local" },
    ],
    tags,
    paths,
    components: { schemas },
  };
}

export function setupSwagger(app: Application): void {
  const document = buildOpenApiDocument();
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(document));
  app.get("/api/docs.json", (_req, res) => {
    res.json(document);
  });
  console.log("📘 Swagger UI: /api/docs  |  OpenAPI JSON: /api/docs.json");
}
