import { Module } from '@nestjs/common';
import { PetsModule } from '../pets/pets.module.js';
import { VeterinariansModule } from '../veterinarians/veterinarians.module.js';
import { APPOINTMENT_REPOSITORY } from './domain/interfaces/appointment-repository.interface.js';
import { AppointmentRepository } from './infrastructure/persistence/repositories/appointment.repository.js';
import { CreateAppointmentUseCase } from './application/use-cases/create-appointment.use-case.js';
import { UpdateAppointmentUseCase } from './application/use-cases/update-appointment.use-case.js';
import { DeleteAppointmentUseCase } from './application/use-cases/delete-appointment.use-case.js';
import { GetAppointmentUseCase } from './application/use-cases/get-appointment.use-case.js';
import { ListAppointmentsUseCase } from './application/use-cases/list-appointments.use-case.js';
import { AppointmentsController } from './presentation/http/controllers/appointments.controller.js';

@Module({
  imports: [PetsModule, VeterinariansModule],
  controllers: [AppointmentsController],
  providers: [
    AppointmentRepository,
    { provide: APPOINTMENT_REPOSITORY, useExisting: AppointmentRepository },
    CreateAppointmentUseCase,
    UpdateAppointmentUseCase,
    DeleteAppointmentUseCase,
    GetAppointmentUseCase,
    ListAppointmentsUseCase,
  ],
  exports: [APPOINTMENT_REPOSITORY],
})
export class AppointmentsModule {}
