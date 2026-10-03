import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface ConsultationI {
  id?: number;
  appointment_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Consultation extends Model {
  public id!: number;
  public appointment_id!: number;
  public name!: string;
  public description!: string | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Consultation.init(
  {
    appointment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name cannot be empty" },
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Consultation",
    tableName: "consultations",
    timestamps: true,
  }
);
