import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface OwnerI {
  id?: number;
  document_type: string;
  document_number: string;
  name: string;
  phone: string;
  email: string;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Owner extends Model {
  public id!: number;
  public document_type!: string;
  public document_number!: string;
  public name!: string;
  public phone!: string;
  public email!: string;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Owner.init(
  {
    document_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    document_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name cannot be empty" },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: { msg: "Email must be a valid email address" },
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Owner",
    tableName: "owners",
    timestamps: true,
  }
);
