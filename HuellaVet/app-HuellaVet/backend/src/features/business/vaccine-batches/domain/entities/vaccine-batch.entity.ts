export interface VaccineBatchProps {
  id?: number;
  vaccineId: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class VaccineBatch {
  id?: number;
  vaccineId: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: VaccineBatchProps) {
    this.id = props.id;
    this.vaccineId = props.vaccineId;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<VaccineBatchProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): VaccineBatch {
    if (!props.vaccineId) {
      throw new Error('El lote debe estar asociado a una vacuna');
    }

    if (!props.name?.trim()) {
      throw new Error('El nombre del lote de vacuna es requerido');
    }

    return new VaccineBatch(props);
  }

  static reconstitute(props: VaccineBatchProps): VaccineBatch {
    return new VaccineBatch(props);
  }

  update(
    props: Partial<Omit<VaccineBatchProps, 'id' | 'vaccineId' | 'isActive' | 'createdAt' | 'updatedAt'>>,
  ): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del lote de vacuna es requerido');
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
