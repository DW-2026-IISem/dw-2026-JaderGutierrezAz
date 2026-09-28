import { VaccineBatch } from "./vaccine-batch.model";
import { Vaccine } from "../vaccine/vaccine.model";

VaccineBatch.belongsTo(Vaccine, { foreignKey: "vaccine_id", as: "vaccine" });
Vaccine.hasMany(VaccineBatch, { foreignKey: "vaccine_id", as: "batches" });
