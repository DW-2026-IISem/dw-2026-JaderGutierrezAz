import { OwnerRoutes } from "../features/business/owner/owner.routes";
import { PetRoutes } from "../features/business/pet/pet.routes";
import { VeterinarianRoutes } from "../features/business/veterinarian/veterinarian.routes";
import { AppointmentRoutes } from "../features/business/appointment/appointment.routes";
import { ConsultationRoutes } from "../features/business/consultation/consultation.routes";
import { VaccineRoutes } from "../features/business/vaccine/vaccine.routes";

export class Routes {
  public ownerRoutes: OwnerRoutes = new OwnerRoutes();
  public petRoutes: PetRoutes = new PetRoutes();
  public veterinarianRoutes: VeterinarianRoutes = new VeterinarianRoutes();
  public appointmentRoutes: AppointmentRoutes = new AppointmentRoutes();
  public consultationRoutes: ConsultationRoutes = new ConsultationRoutes();
  public vaccineRoutes: VaccineRoutes = new VaccineRoutes();
}
