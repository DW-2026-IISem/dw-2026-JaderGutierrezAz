import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
var cors = require("cors");
import { sequelize, getDatabaseInfo, testConnection } from "../database/db";
import "../features/business/owner/owner.model";
import "../features/business/pet/pet.model";
import "../features/business/pet/pet.associations";
import "../features/business/veterinarian/veterinarian.model";
import "../features/business/appointment/appointment.model";
import "../features/business/appointment/appointment.associations";
import "../features/business/consultation/consultation.model";
import "../features/business/consultation/consultation.associations";
import "../features/business/vaccine/vaccine.model";
import { Routes } from "../routes/index";
import { setupSwagger } from "../swagger/index";
dotenv.config();

export class App {
  public app: Application;
    public routePrv: Routes = new Routes();
    private docs(): void {
      setupSwagger(this.app);
    }
  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.docs();
    this.dbConnection();
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
      this.routePrv.ownerRoutes.routes(this.app);
      this.routePrv.petRoutes.routes(this.app);
      this.routePrv.veterinarianRoutes.routes(this.app);
      this.routePrv.appointmentRoutes.routes(this.app);
      this.routePrv.consultationRoutes.routes(this.app);
      this.routePrv.vaccineRoutes.routes(this.app);
  }

  private async dbConnection(): Promise<void> {
        try {
      const dbInfo = getDatabaseInfo();
      console.log(`🔗 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      const isConnected = await testConnection();

      if (!isConnected) {
        throw new Error(`No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`);
      }

      // alter: true actualiza columnas faltantes. force: false no recrea tablas.
      await sequelize.sync({ force: false, alter: true });
      console.log(`📦 Base de datos sincronizada exitosamente`);
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1);
    }
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
  }
}
