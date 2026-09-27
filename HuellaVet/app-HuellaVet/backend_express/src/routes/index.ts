import { OwnerRoutes } from "../features/business/owner/owner.routes";
import { PetRoutes } from "../features/business/pet/pet.routes";
import { VeterinarianRoutes } from "../features/business/veterinarian/veterinarian.routes";

export class Routes {
  public ownerRoutes: OwnerRoutes = new OwnerRoutes();
  public petRoutes: PetRoutes = new PetRoutes();
  public veterinarianRoutes: VeterinarianRoutes = new VeterinarianRoutes();
}
