import { isValidEmail } from '../validators/owner-email.validator.js';
import { isValidPhone } from '../validators/owner-phone.validator.js';

export interface OwnerProps {
  id?: number;
  documentType: string;
  documentNumber: string;
  name: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

export class Owner {
  id?: number;
  documentType: string;
  documentNumber: string;
  name: string;
  phone?: string;
  email?: string;
  isActive: boolean;

  private constructor(props: OwnerProps) {
    this.id = props.id;
    this.documentType = props.documentType;
    this.documentNumber = props.documentNumber;
    this.name = props.name;
    this.phone = props.phone;
    this.email = props.email;
    this.isActive = props.isActive ?? true;
  }

  static create(props: Omit<OwnerProps, 'id' | 'isActive'>): Owner {
    if (!props.documentType?.trim()) {
      throw new Error('El tipo de documento del propietario es requerido');
    }

    if (!props.documentNumber?.trim()) {
      throw new Error('El número de documento del propietario es requerido');
    }

    if (!props.name?.trim()) {
      throw new Error('El nombre del propietario es requerido');
    }

    if (props.email && !isValidEmail(props.email)) {
      throw new Error('El email del propietario no es válido');
    }

    if (props.phone && !isValidPhone(props.phone)) {
      throw new Error('El teléfono del propietario no es válido');
    }

    return new Owner(props);
  }

  static reconstitute(props: OwnerProps): Owner {
    return new Owner(props);
  }

  update(props: Partial<Omit<OwnerProps, 'id' | 'isActive'>>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) {
        throw new Error('El nombre del propietario es requerido');
      }
      this.name = props.name;
    }

    if (props.documentType !== undefined) {
      if (!props.documentType.trim()) {
        throw new Error('El tipo de documento del propietario es requerido');
      }
      this.documentType = props.documentType;
    }

    if (props.documentNumber !== undefined) {
      if (!props.documentNumber.trim()) {
        throw new Error('El número de documento del propietario es requerido');
      }
      this.documentNumber = props.documentNumber;
    }

    if (props.phone !== undefined) {
      if (props.phone && !isValidPhone(props.phone)) {
        throw new Error('El teléfono del propietario no es válido');
      }
      this.phone = props.phone;
    }

    if (props.email !== undefined) {
      if (props.email && !isValidEmail(props.email)) {
        throw new Error('El email del propietario no es válido');
      }
      this.email = props.email;
    }
  }

  deactivate(): void {
    this.isActive = false;
  }
}
