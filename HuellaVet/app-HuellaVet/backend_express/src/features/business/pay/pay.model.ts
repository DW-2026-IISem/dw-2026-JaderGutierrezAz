import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export type PayReferenceType = "appointment";
export type PayState = "pending" | "paid" | "cancelled";

export interface PayI {
  id?: number;
  reference_type: PayReferenceType;
  reference_id: number;
  method: string;
  amount: number;
  date: Date;
  state: PayState;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Pay extends Model {
  public id!: number;
  public reference_type!: PayReferenceType;
  public reference_id!: number;
  public method!: string;
  public amount!: number;
  public date!: Date;
  public state!: PayState;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Pay.init(
  {
    reference_type: {
      type: DataTypes.ENUM("appointment"),
      allowNull: false,
    },
    reference_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Method cannot be empty" },
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: "Amount cannot be negative" },
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    state: {
      type: DataTypes.ENUM("pending", "paid", "cancelled"),
      defaultValue: "pending",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Pay",
    tableName: "pays",
    timestamps: true,
  }
);
