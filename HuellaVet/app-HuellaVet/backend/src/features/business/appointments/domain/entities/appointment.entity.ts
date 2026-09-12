export interface AppointmentProps {
  id?: number;
  petId: number;
  veterinarianId: number;
  startDate: Date;
  endDate: Date;
  reason?: string;
  state?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Appointment {
  id?: number;
  petId: number;
  veterinarianId: number;
  startDate: Date;
  endDate: Date;
  reason?: string;
  state: string;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: AppointmentProps) {
    this.id = props.id;
    this.petId = props.petId;
    this.veterinarianId = props.veterinarianId;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
    this.reason = props.reason;
    this.state = props.state ?? 'PENDIENTE';
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  private static validateDates(startDate: Date, endDate: Date): void {
    if (!(startDate instanceof Date) || Number.isNaN(startDate.getTime())) {
      throw new Error('La fecha de inicio de la cita no es válida');
    }

    if (!(endDate instanceof Date) || Number.isNaN(endDate.getTime())) {
      throw new Error('La fecha de fin de la cita no es válida');
    }

    if (startDate.getTime() >= endDate.getTime()) {
      throw new Error('La fecha de inicio debe ser anterior a la fecha de fin');
    }
  }

  static create(
    props: Omit<AppointmentProps, 'id' | 'state' | 'createdAt' | 'updatedAt'>,
  ): Appointment {
    if (!props.petId) {
      throw new Error('La cita debe estar asociada a una mascota');
    }

    if (!props.veterinarianId) {
      throw new Error('La cita debe estar asociada a un veterinario');
    }

    Appointment.validateDates(props.startDate, props.endDate);

    return new Appointment(props);
  }

  static reconstitute(props: AppointmentProps): Appointment {
    return new Appointment(props);
  }

  update(
    props: Partial<Omit<AppointmentProps, 'id' | 'petId' | 'veterinarianId' | 'createdAt' | 'updatedAt'>>,
  ): void {
    const nextStart = props.startDate ?? this.startDate;
    const nextEnd = props.endDate ?? this.endDate;

    if (props.startDate !== undefined || props.endDate !== undefined) {
      Appointment.validateDates(nextStart, nextEnd);
      this.startDate = nextStart;
      this.endDate = nextEnd;
    }

    if (props.reason !== undefined) {
      this.reason = props.reason;
    }

    if (props.state !== undefined) {
      if (!props.state.trim()) {
        throw new Error('El estado de la cita es requerido');
      }
      this.state = props.state;
    }
  }

  overlapsWith(startDate: Date, endDate: Date): boolean {
    return this.startDate.getTime() < endDate.getTime()
      && startDate.getTime() < this.endDate.getTime();
  }
}
