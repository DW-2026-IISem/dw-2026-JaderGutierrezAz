import { VaccineApplication } from "./vaccine-application.model";
import { Consultation } from "../consultation/consultation.model";
import { VaccineBatch } from "../vaccine-batch/vaccine-batch.model";

VaccineApplication.belongsTo(Consultation, { foreignKey: "consultation_id", as: "consultation" });
Consultation.hasMany(VaccineApplication, { foreignKey: "consultation_id", as: "vaccineApplications" });

VaccineApplication.belongsTo(VaccineBatch, { foreignKey: "vaccine_batch_id", as: "vaccineBatch" });
VaccineBatch.hasMany(VaccineApplication, { foreignKey: "vaccine_batch_id", as: "applications" });
