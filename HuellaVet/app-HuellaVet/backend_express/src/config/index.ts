import dotenv from "dotenv";
import express, { Application, ErrorRequestHandler } from "express";
import morgan from "morgan";
var cors = require("cors");

import { sequelize, getDatabaseInfo, testConnection } from "../database/db";

// Fase I — Business
import "../features/business/owner/owner.model";
import "../features/business/pet/pet.model";
import "../features/business/pet/pet.associations";
import "../features/business/veterinarian/veterinarian.model";
import "../features/business/appointment/appointment.model";
import "../features/business/appointment/appointment.associations";
import "../features/business/consultation/consultation.model";
import "../features/business/consultation/consultation.associations";
import "../features/business/vaccine/vaccine.model";
import "../features/business/vaccine-batch/vaccine-batch.model";
import "../features/business/vaccine-batch/vaccine-batch.associations";
import "../features/business/recipe/recipe.model";
import "../features/business/recipe/recipe.associations";
import "../features/business/vaccine-application/vaccine-application.model";
import "../features/business/vaccine-application/vaccine-application.associations";
import "../features/business/pay/pay.model";

// Fase II — Auth con RBAC: primero los seis modelos, después las asociaciones
// (las asociaciones referencian los modelos, no al revés).
import "../features/auth/users/user.model";
import "../features/auth/roles/role.model";
import "../features/auth/resources/resource.model";
import "../features/auth/role-users/role-user.model";
import "../features/auth/resource-roles/resource-role.model";
import "../features/auth/refresh-tokens/refresh-token.model";
import "../features/auth/rbac.associations";

import { Routes } from "../routes/index";
import { setupSwagger } from "../swagger/index";

dotenv.config();

export class App {
  public app: Application;
  public routePrv: Routes = new Routes();

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.docs();
    this.errorHandling();
  }

  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    // Fase I — Business (todavía SIN AUTH; pasa a JWT + RBAC en ISS-13)
    this.routePrv.ownerRoutes.routes(this.app);
    this.routePrv.petRoutes.routes(this.app);
    this.routePrv.veterinarianRoutes.routes(this.app);
    this.routePrv.appointmentRoutes.routes(this.app);
    this.routePrv.consultationRoutes.routes(this.app);
    this.routePrv.vaccineRoutes.routes(this.app);
    this.routePrv.vaccineBatchRoutes.routes(this.app);
    this.routePrv.recipeRoutes.routes(this.app);
    this.routePrv.vaccineApplicationRoutes.routes(this.app);
    this.routePrv.payRoutes.routes(this.app);

    // Fase II — Auth con RBAC: las rutas de cada feature se añaden en su
    // propio ISS (users en ISS-10, roles/resources en ISS-11, etc.)
  }

  private docs(): void {
    setupSwagger(this.app);
  }

  /**
   * Errores que ocurren antes de llegar a un controller (p. ej. un JSON
   * malformado). Sin esto, Express responde con su página de error por
   * defecto, que filtra el stack trace. Debe registrarse después de las
   * rutas: Express reconoce un middleware de error por su aridad de 4
   * argumentos.
   */
  private errorHandling(): void {
    const bodyErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
      if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json({ error: "Malformed JSON body" });
        return;
      }
      next(err);
    };
    this.app.use(bodyErrorHandler);
  }

  private async dbConnection(): Promise<void> {
    try {
      const dbInfo = getDatabaseInfo();
      console.log(`🔗 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error(`No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`);
      }

      const force = process.env.DB_SYNC_FORCE === "true";
      const isMysql =
        sequelize.getDialect() === "mysql" || sequelize.getDialect() === "mariadb";

      if (isMysql) {
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
      }
      try {
        await sequelize.sync({ force, alter: !force });
      } finally {
        if (isMysql) {
          await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
        }
      }

      console.log(
        force
          ? "📦 Base de datos recreada (DB_SYNC_FORCE=true)"
          : "📦 Base de datos sincronizada exitosamente"
      );
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1);
    }
  }

  async listen() {
    // Primero la BD (conexión + sync), después abrir el puerto: si el puerto
    // se abre antes de terminar sync({ alter: true }), las sentencias DDL
    // compiten con peticiones que ya están entrando.
    await this.dbConnection();
    await this.app.listen(this.app.get('port'));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
  }
}
