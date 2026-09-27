import { Appointment } from "./appointment.model";
import { Pet } from "../pet/pet.model";
import { Veterinarian } from "../veterinarian/veterinarian.model";

Appointment.belongsTo(Pet, { foreignKey: "pet_id", as: "pet" });
Pet.hasMany(Appointment, { foreignKey: "pet_id", as: "appointments" });

Appointment.belongsTo(Veterinarian, { foreignKey: "veterinarian_id", as: "veterinarian" });
Veterinarian.hasMany(Appointment, { foreignKey: "veterinarian_id", as: "appointments" });
