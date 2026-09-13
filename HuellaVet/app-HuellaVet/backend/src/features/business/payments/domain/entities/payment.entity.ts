export type PaymentReferenceType = 'APPOINTMENT';

export interface PaymentProps {
  id?: number;
  referenceType: PaymentReferenceType;
  referenceId: number;
  method: string;
  amount: number;
  date: Date;
  state?: string;
}

export class Payment {
  id?: number;
  referenceType: PaymentReferenceType;
  referenceId: number;
  method: string;
  amount: number;
  date: Date;
  state: string;

  private constructor(props: PaymentProps) {
    this.id = props.id;
    this.referenceType = props.referenceType;
    this.referenceId = props.referenceId;
    this.method = props.method;
    this.amount = props.amount;
    this.date = props.date;
    this.state = props.state ?? 'PENDIENTE';
  }

  static create(props: Omit<PaymentProps, 'id' | 'state'>): Payment {
    if (!props.referenceType) {
      throw new Error('El tipo de referencia del pago es requerido');
    }

    if (!props.referenceId) {
      throw new Error('El pago debe estar asociado a una referencia válida');
    }

    if (!props.method?.trim()) {
      throw new Error('El método de pago es requerido');
    }

    if (!props.amount || props.amount <= 0) {
      throw new Error('El monto del pago debe ser mayor a cero');
    }

    if (!(props.date instanceof Date) || Number.isNaN(props.date.getTime())) {
      throw new Error('La fecha del pago no es válida');
    }

    return new Payment(props);
  }

  static reconstitute(props: PaymentProps): Payment {
    return new Payment(props);
  }

  update(props: Partial<Pick<PaymentProps, 'method' | 'amount' | 'date' | 'state'>>): void {
    if (props.method !== undefined) {
      if (!props.method.trim()) {
        throw new Error('El método de pago es requerido');
      }
      this.method = props.method;
    }

    if (props.amount !== undefined) {
      if (props.amount <= 0) {
        throw new Error('El monto del pago debe ser mayor a cero');
      }
      this.amount = props.amount;
    }

    if (props.date !== undefined) {
      if (!(props.date instanceof Date) || Number.isNaN(props.date.getTime())) {
        throw new Error('La fecha del pago no es válida');
      }
      this.date = props.date;
    }

    if (props.state !== undefined) {
      if (!props.state.trim()) {
        throw new Error('El estado del pago es requerido');
      }
      this.state = props.state;
    }
  }
}
