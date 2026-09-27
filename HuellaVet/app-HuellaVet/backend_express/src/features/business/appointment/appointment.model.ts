import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export type AppointmentState = "scheduled" | "completed" | "cancelled";

export interface AppointmentI {
  id?: number;
  pet_id: number;
  veterinarian_id: number;
  start_date: Date;
  end_date: Date;
  reason: string;
  state: AppointmentState;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Appointment extends Model {
  public id!: number;
  public pet_id!: number;
  public veterinarian_id!: number;
  public start_date!: Date;
  public end_date!: Date;
  public reason!: string;
  public state!: AppointmentState;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    pet_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    veterinarian_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Reason cannot be empty" },
      },
    },
    state: {
      type: DataTypes.ENUM("scheduled", "completed", "cancelled"),
      defaultValue: "scheduled",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Appointment",
    tableName: "appointments",
    timestamps: true,
  }
);
