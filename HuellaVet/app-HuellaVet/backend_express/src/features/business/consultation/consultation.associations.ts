import { Consultation } from "./consultation.model";
import { Appointment } from "../appointment/appointment.model";

Consultation.belongsTo(Appointment, { foreignKey: "appointment_id", as: "appointment" });
Appointment.hasMany(Consultation, { foreignKey: "appointment_id", as: "consultations" });
