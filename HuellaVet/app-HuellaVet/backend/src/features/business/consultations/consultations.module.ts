import { Module } from '@nestjs/common';
import { AppointmentsModule } from '../appointments/appointments.module.js';
import { CONSULTATION_REPOSITORY } from './domain/interfaces/consultation-repository.interface.js';
import { ConsultationRepository } from './infrastructure/persistence/repositories/consultation.repository.js';
import { CreateConsultationUseCase } from './application/use-cases/create-consultation.use-case.js';
import { UpdateConsultationUseCase } from './application/use-cases/update-consultation.use-case.js';
import { DeleteConsultationUseCase } from './application/use-cases/delete-consultation.use-case.js';
import { GetConsultationUseCase } from './application/use-cases/get-consultation.use-case.js';
import { ListConsultationsUseCase } from './application/use-cases/list-consultations.use-case.js';
import { ConsultationsController } from './presentation/http/controllers/consultations.controller.js';

@Module({
  imports: [AppointmentsModule],
  controllers: [ConsultationsController],
  providers: [
    ConsultationRepository,
    { provide: CONSULTATION_REPOSITORY, useExisting: ConsultationRepository },
    CreateConsultationUseCase,
    UpdateConsultationUseCase,
    DeleteConsultationUseCase,
    GetConsultationUseCase,
    ListConsultationsUseCase,
  ],
  exports: [CONSULTATION_REPOSITORY],
})
export class ConsultationsModule {}
