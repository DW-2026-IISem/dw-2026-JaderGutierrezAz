import { Sequelize } from 'sequelize-typescript';
import { DatabaseDialect } from '../../../config/environment/env.interface.js';
import { getSequelizeOptions } from './sequelize.options.js';

import { OwnerModel } from '../../../features/business/owners/infrastructure/persistence/models/owner.model.js';
import { PetModel } from '../../../features/business/pets/infrastructure/persistence/models/pet.model.js';
import { VeterinarianModel } from '../../../features/business/veterinarians/infrastructure/persistence/models/veterinarian.model.js';
import { AppointmentModel } from '../../../features/business/appointments/infrastructure/persistence/models/appointment.model.js';
import { ConsultationModel } from '../../../features/business/consultations/infrastructure/persistence/models/consultation.model.js';
import { VaccineModel } from '../../../features/business/vaccines/infrastructure/persistence/models/vaccine.model.js';
import { VaccineBatchModel } from '../../../features/business/vaccine-batches/infrastructure/persistence/models/vaccine-batch.model.js';
import { VaccineApplicationModel } from '../../../features/business/vaccine-applications/infrastructure/persistence/models/vaccine-application.model.js';

export const ALL_MODELS = [
  OwnerModel,
  PetModel,
  VeterinarianModel,
  AppointmentModel,
  ConsultationModel,
  VaccineModel,
  VaccineBatchModel,
  VaccineApplicationModel,
];

export async function createSequelizeInstance(
  dialect: DatabaseDialect,
): Promise<Sequelize> {
  const options = getSequelizeOptions(dialect);

  let dialectModule: any;

  switch (dialect) {
    case DatabaseDialect.MySQL:
      dialectModule = (await import('mysql2')).default;
      break;
    case DatabaseDialect.Postgres:
      dialectModule = (await import('pg')).default;
      break;
    case DatabaseDialect.MSSQL:
      dialectModule = (await import('tedious')).default;
      break;
    case DatabaseDialect.Oracle:
      dialectModule = (await import('oracledb')).default;
      break;
    default:
      throw new Error(`Dialecto no soportado: ${dialect}`);
  }

  const sequelize = new Sequelize({
    ...options,
    dialectModule,
    models: ALL_MODELS,
  } as any);

  try {
    await sequelize.authenticate();
    console.log(`✅ Conexión exitosa a ${dialect.toUpperCase()}`);
  } catch (error: any) {
    console.error(
      `❌ Error conectando a ${dialect.toUpperCase()}:`,
      error.message,
    );
    throw error;
  }

  if (process.env.NODE_ENV !== 'production') {
    await sequelize.sync({ alter: false });
    console.log('✅ Tablas sincronizadas');
  }

  return sequelize;
}
