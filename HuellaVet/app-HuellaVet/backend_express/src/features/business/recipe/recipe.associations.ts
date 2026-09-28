import { Recipe } from "./recipe.model";
import { Consultation } from "../consultation/consultation.model";

Recipe.belongsTo(Consultation, { foreignKey: "consultation_id", as: "consultation" });
Consultation.hasMany(Recipe, { foreignKey: "consultation_id", as: "recipes" });
