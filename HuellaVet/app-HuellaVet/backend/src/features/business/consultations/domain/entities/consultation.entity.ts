export interface ConsultationProps {
  id?: number;
  appointmentId: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Consultation {
  id?: number;
  appointmentId: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: ConsultationProps) {
    this.id = props.id;
    this.appointmentId = props.appointmentId;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<ConsultationProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Consultation {
    if (!props.appointmentId) {
      throw new Error('La consulta debe estar asociada a una cita');
    }

    if (!props.name?.trim()) {
      throw new Error('El nombre de la consulta es requerido');
    }

    return new Consultation(props);
  }

  static reconstitute(props: ConsultationProps): Consultation {
    return new Consultation(props);
  }

  update(
    props: Partial<Omit<ConsultationProps, 'id' | 'appointmentId' | 'isActive' | 'createdAt' | 'updatedAt'>>,
  ): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre de la consulta es requerido');
      }
      this.name = props.name;
    }

    if (props.description !== undefined) {
      this.description = props.description;
    }
  }

  deactivate(): void {
    this.isActive = false;
  }
}
