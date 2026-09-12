import { Inject, Injectable } from '@nestjs/common';
import { PetNotFoundException } from '../../../pets/domain/exceptions/pet-not-found.exception.js';
import {
  PET_REPOSITORY,
  type IPetRepository,
} from '../../../pets/domain/interfaces/pet-repository.interface.js';
import { VeterinarianNotFoundException } from '../../../veterinarians/domain/exceptions/veterinarian-not-found.exception.js';
import {
  VETERINARIAN_REPOSITORY,
  type IVeterinarianRepository,
} from '../../../veterinarians/domain/interfaces/veterinarian-repository.interface.js';
import { Appointment } from '../../domain/entities/appointment.entity.js';
import { AppointmentOverlapException } from '../../domain/exceptions/appointment-overlap.exception.js';
import {
  APPOINTMENT_REPOSITORY,
  type IAppointmentRepository,
} from '../../domain/interfaces/appointment-repository.interface.js';
import { CreateAppointmentDto } from '../dto/create-appointment.dto.js';
import { AppointmentMapper } from '../mappers/appointment.mapper.js';

@Injectable()
export class CreateAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject(PET_REPOSITORY)
    private readonly petRepository: IPetRepository,
    @Inject(VETERINARIAN_REPOSITORY)
    private readonly veterinarianRepository: IVeterinarianRepository,
  ) {}

  async execute(dto: CreateAppointmentDto) {
    const pet = await this.petRepository.findById(dto.petId);
    if (!pet) {
      throw new PetNotFoundException(dto.petId);
    }

    const veterinarian = await this.veterinarianRepository.findById(
      dto.veterinarianId,
    );
    if (!veterinarian) {
      throw new VeterinarianNotFoundException(dto.veterinarianId);
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    const overlapping = await this.appointmentRepository.findOverlapping(
      dto.veterinarianId,
      startDate,
      endDate,
    );
    if (overlapping.length > 0) {
      throw new AppointmentOverlapException(dto.veterinarianId);
    }

    const appointment = Appointment.create({
      petId: dto.petId,
      veterinarianId: dto.veterinarianId,
      startDate,
      endDate,
      reason: dto.reason,
    });

    const created = await this.appointmentRepository.create(appointment);
    return AppointmentMapper.toResponse(created);
  }
}
