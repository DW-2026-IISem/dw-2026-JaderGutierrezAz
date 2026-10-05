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
import { usersSwagger } from "../features/auth/users/users.swagger";
import { rolesSwagger } from "../features/auth/roles/roles.swagger";
import { resourcesSwagger } from "../features/auth/resources/resources.swagger";
import { roleUsersSwagger } from "../features/auth/role-users/role-users.swagger";
import { resourceRolesSwagger } from "../features/auth/resource-roles/resource-roles.swagger";
import { refreshTokensSwagger } from "../features/auth/refresh-tokens/refresh-tokens.swagger";
import { sessionSwagger } from "../features/auth/session/session.swagger";
import { bearerSecurityScheme } from "./../shared/http/swagger-security";

export type FeatureSwaggerModule = {
  tags: unknown[];
  paths: Record<string, unknown>;
  components?: { schemas?: Record<string, unknown> };
};

const featureSwaggerModules: FeatureSwaggerModule[] = [
  // Fase I — Business
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
  // Fase II — Auth con RBAC
  sessionSwagger,
  refreshTokensSwagger,
  usersSwagger,
  rolesSwagger,
  resourcesSwagger,
  roleUsersSwagger,
  resourceRolesSwagger,
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
        "API HuellaVet (Express + Sequelize). Fase I: negocio. Fase II: JWT + RBAC. " +
        "Las operaciones OPEN (login/refresh/logout) anulan la seguridad por defecto con security: [].",
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 4000}`, description: "Local" },
    ],
    security: [{ bearerAuth: [] }],
    tags,
    paths,
    components: {
      securitySchemes: bearerSecurityScheme,
      schemas,
    },
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
