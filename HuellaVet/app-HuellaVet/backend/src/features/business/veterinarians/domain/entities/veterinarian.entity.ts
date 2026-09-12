export interface VeterinarianProps {
  id?: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Veterinarian {
  id?: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: VeterinarianProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<VeterinarianProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Veterinarian {
    if (!props.name?.trim()) {
      throw new Error('El nombre del veterinario es requerido');
    }

    return new Veterinarian(props);
  }

  static reconstitute(props: VeterinarianProps): Veterinarian {
    return new Veterinarian(props);
  }

  update(
    props: Partial<Omit<VeterinarianProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>>,
  ): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del veterinario es requerido');
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
