import { OwnerRoutes } from "../features/business/owner/owner.routes";
import { PetRoutes } from "../features/business/pet/pet.routes";
import { VeterinarianRoutes } from "../features/business/veterinarian/veterinarian.routes";
import { AppointmentRoutes } from "../features/business/appointment/appointment.routes";
import { ConsultationRoutes } from "../features/business/consultation/consultation.routes";
import { VaccineRoutes } from "../features/business/vaccine/vaccine.routes";
import { VaccineBatchRoutes } from "../features/business/vaccine-batch/vaccine-batch.routes";
import { RecipeRoutes } from "../features/business/recipe/recipe.routes";
import { VaccineApplicationRoutes } from "../features/business/vaccine-application/vaccine-application.routes";
import { PayRoutes } from "../features/business/pay/pay.routes";
import { UsersRoutes } from "../features/auth/users/users.routes";
import { RolesRoutes } from "../features/auth/roles/roles.routes";
import { ResourcesRoutes } from "../features/auth/resources/resources.routes";
import { RoleUsersRoutes } from "../features/auth/role-users/role-users.routes";
import { ResourceRolesRoutes } from "../features/auth/resource-roles/resource-roles.routes";
import { RefreshTokensRoutes } from "../features/auth/refresh-tokens/refresh-tokens.routes";
import { SessionRoutes } from "../features/auth/session/session.routes";

export class Routes {
  public ownerRoutes: OwnerRoutes = new OwnerRoutes();
  public petRoutes: PetRoutes = new PetRoutes();
  public veterinarianRoutes: VeterinarianRoutes = new VeterinarianRoutes();
  public appointmentRoutes: AppointmentRoutes = new AppointmentRoutes();
  public consultationRoutes: ConsultationRoutes = new ConsultationRoutes();
  public vaccineRoutes: VaccineRoutes = new VaccineRoutes();
  public vaccineBatchRoutes: VaccineBatchRoutes = new VaccineBatchRoutes();
  public recipeRoutes: RecipeRoutes = new RecipeRoutes();
  public vaccineApplicationRoutes: VaccineApplicationRoutes = new VaccineApplicationRoutes();
  public payRoutes: PayRoutes = new PayRoutes();
  public usersRoutes: UsersRoutes = new UsersRoutes();
  public rolesRoutes: RolesRoutes = new RolesRoutes();
  public resourcesRoutes: ResourcesRoutes = new ResourcesRoutes();
  public roleUsersRoutes: RoleUsersRoutes = new RoleUsersRoutes();
  public resourceRolesRoutes: ResourceRolesRoutes = new ResourceRolesRoutes();
  public refreshTokensRoutes: RefreshTokensRoutes = new RefreshTokensRoutes();
  public sessionRoutes: SessionRoutes = new SessionRoutes();
}
