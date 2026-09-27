import { Pet } from "./pet.model";
import { Owner } from "../owner/owner.model";

Pet.belongsTo(Owner, { foreignKey: "owner_id", as: "owner" });
Owner.hasMany(Pet, { foreignKey: "owner_id", as: "pets" });
