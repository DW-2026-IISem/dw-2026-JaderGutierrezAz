export interface RecipeProps {
  id?: number;
  consultationId: number;
  name: string;
  description?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Recipe {
  id?: number;
  consultationId: number;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  private constructor(props: RecipeProps) {
    this.id = props.id;
    this.consultationId = props.consultationId;
    this.name = props.name;
    this.description = props.description;
    this.isActive = props.isActive ?? true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(
    props: Omit<RecipeProps, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Recipe {
    if (!props.consultationId) {
      throw new Error('La receta debe estar asociada a una consulta');
    }

    if (!props.name?.trim()) {
      throw new Error('El nombre de la receta es requerido');
    }

    return new Recipe(props);
  }

  static reconstitute(props: RecipeProps): Recipe {
    return new Recipe(props);
  }

  update(
    props: Partial<Omit<RecipeProps, 'id' | 'consultationId' | 'isActive' | 'createdAt' | 'updatedAt'>>,
  ): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre de la receta es requerido');
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
