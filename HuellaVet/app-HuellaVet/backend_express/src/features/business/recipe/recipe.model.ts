import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface RecipeI {
  id?: number;
  consultation_id: number;
  name: string;
  description?: string | null;
  is_active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Recipe extends Model {
  public id!: number;
  public consultation_id!: number;
  public name!: string;
  public description!: string | null;
  public is_active!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Recipe.init(
  {
    consultation_id: {
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
    modelName: "Recipe",
    tableName: "recipes",
    timestamps: true,
  }
);
