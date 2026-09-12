export interface PetProps {
  id?: number;
  ownerId: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Pet {
  id?: number;
  ownerId: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: PetProps) {
    this.id = props.id;
    this.ownerId = props.ownerId;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: Omit<PetProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>): Pet {
    if (!props.ownerId) {
      throw new Error('La mascota debe estar asociada a un propietario');
    }

    if (!props.name?.trim()) {
      throw new Error('El nombre de la mascota es requerido');
    }

    return new Pet(props);
  }

  static reconstitute(props: PetProps): Pet {
    return new Pet(props);
  }

  update(props: Partial<Omit<PetProps, 'id' | 'ownerId' | 'isActive' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre de la mascota es requerido');
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
