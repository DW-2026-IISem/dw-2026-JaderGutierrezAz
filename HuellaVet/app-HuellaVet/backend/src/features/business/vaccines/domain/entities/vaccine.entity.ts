export interface VaccineProps {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Vaccine {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: VaccineProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<VaccineProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Vaccine {
    if (!props.name?.trim()) {
      throw new Error('El nombre de la vacuna es requerido');
    }

    return new Vaccine(props);
  }

  static reconstitute(props: VaccineProps): Vaccine {
    return new Vaccine(props);
  }

  update(
    props: Partial<Omit<VaccineProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>>,
  ): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre de la vacuna es requerido');
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
