import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface.js';
import { Appointment } from '../entities/appointment.entity.js';

export const APPOINTMENT_REPOSITORY = 'APPOINTMENT_REPOSITORY';

export interface AppointmentFindAllParams {
  page?: number;
  limit?: number;
  petId?: number;
  veterinarianId?: number;
}

export interface IAppointmentRepository {
  create(appointment: Appointment): Promise<Appointment>;
  update(appointment: Appointment): Promise<Appointment>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Appointment | null>;
  findAll(params: AppointmentFindAllParams): Promise<PaginatedResult<Appointment>>;
  findOverlapping(
    veterinarianId: number,
    startDate: Date,
    endDate: Date,
    excludeId?: number,
  ): Promise<Appointment[]>;
}
