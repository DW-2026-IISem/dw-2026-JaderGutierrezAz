export interface VaccineApplicationProps {
  id?: number;
  consultationId: number;
  vaccineBatchId: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class VaccineApplication {
  id?: number;
  consultationId: number;
  vaccineBatchId: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: VaccineApplicationProps) {
    this.id = props.id;
    this.consultationId = props.consultationId;
    this.vaccineBatchId = props.vaccineBatchId;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<VaccineApplicationProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): VaccineApplication {
    if (!props.consultationId) {
      throw new Error('La aplicación de vacuna debe estar asociada a una consulta');
    }

    if (!props.vaccineBatchId) {
      throw new Error('La aplicación de vacuna debe estar asociada a un lote de vacuna');
    }

    if (!props.name?.trim()) {
      throw new Error('El nombre de la aplicación de vacuna es requerido');
    }

    return new VaccineApplication(props);
  }

  static reconstitute(props: VaccineApplicationProps): VaccineApplication {
    return new VaccineApplication(props);
  }

  update(
    props: Partial<Omit<VaccineApplicationProps, 'id' | 'consultationId' | 'vaccineBatchId' | 'isActive' | 'createdAt' | 'updatedAt'>>,
  ): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre de la aplicación de vacuna es requerido');
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
