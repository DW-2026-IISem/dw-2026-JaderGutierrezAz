import { TestBed } from '@angular/core/testing';
import { Appointment } from '../../../core/models/appointment.model';
import { Pay, PayCreate } from '../../../core/models/pay.model';
import { PayForm } from './pay-form';

const CITAS: Appointment[] = [
  {
    id: 1,
    pet_id: 1,
    veterinarian_id: 1,
    start_date: '2026-10-05T09:00:00.000Z',
    end_date: '2026-10-05T09:30:00.000Z',
    reason: 'Control',
    state: 'scheduled',
  },
  {
    id: 2,
    pet_id: 2,
    veterinarian_id: 1,
    start_date: '2026-10-06T10:00:00.000Z',
    end_date: '2026-10-06T10:30:00.000Z',
    reason: 'Vacunación',
    state: 'scheduled',
  },
];

const PAGO: Pay = {
  id: 5,
  reference_type: 'appointment',
  reference_id: 2,
  method: 'Tarjeta',
  amount: '85000.00',
  date: '2026-10-05T09:35:00.000Z',
  state: 'pending',
};

describe('PayForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PayForm] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(PayForm);
    fixture.componentRef.setInput('appointments', CITAS);
    await fixture.whenStable();
    return { fixture, componente: fixture.componentInstance };
  }

  it('should start empty, in creation mode and invalid', async () => {
    const { componente } = await crear();

    expect(componente.form.controls.reference_id.value).toBeNull();
    expect(componente.form.controls.method.value).toBe('');
    expect(componente.form.controls.amount.value).toBeNull();
    expect(componente.form.controls.date.value).toBeNull();
    expect(componente.form.controls.state.value).toBe('pending');
    expect(componente.form.controls.state.disabled).toBe(false);
    expect(componente.form.invalid).toBe(true);
  });

  it('should label each appointment option with its number and reason', async () => {
    const { componente } = await crear();
    const etiquetas = componente.appointmentOptions().map((opcion) => opcion.label);

    expect(componente.appointmentOptions().map((opcion) => opcion.id)).toEqual([1, 2]);
    expect(etiquetas[0]).toContain('Cita #1 · Control');
    expect(etiquetas[1]).toContain('Cita #2 · Vacunación');
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { componente } = await crear();
    const emitidos: PayCreate[] = [];
    componente.saved.subscribe((cuerpo) => emitidos.push(cuerpo));

    componente.submit();

    expect(emitidos).toEqual([]);
    expect(componente.form.controls.reference_id.touched).toBe(true);
    expect(componente.form.controls.method.touched).toBe(true);
    expect(componente.form.controls.amount.touched).toBe(true);
    expect(componente.form.controls.date.touched).toBe(true);
  });

  it('should reject a method made only of spaces', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ method: '   ' });

    expect(componente.form.controls.method.invalid).toBe(true);
  });

  it('should reject a negative amount and an amount above the DECIMAL(10,2) limit', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ amount: -5 });
    expect(componente.form.controls.amount.invalid).toBe(true);

    componente.form.patchValue({ amount: 100000000 });
    expect(componente.form.controls.amount.invalid).toBe(true);

    componente.form.patchValue({ amount: 0 });
    expect(componente.form.controls.amount.valid).toBe(true);
  });

  it('should require a date even when the other fields are valid', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ reference_id: 1, method: 'Efectivo', amount: 50000 });

    expect(componente.form.controls.date.invalid).toBe(true);
    expect(componente.form.invalid).toBe(true);
  });

  it('should emit the trimmed body with numeric ids, ISO date, fixed reference_type and state when creating', async () => {
    const { componente } = await crear();
    let cuerpo: PayCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.setValue({
      reference_id: 1,
      method: ' Efectivo ',
      amount: 50000,
      date: new Date('2026-11-01T15:00:00.000Z'),
      state: 'pending',
    });
    componente.submit();

    expect(cuerpo).toEqual({
      reference_type: 'appointment',
      reference_id: 1,
      method: 'Efectivo',
      amount: 50000,
      date: '2026-11-01T15:00:00.000Z',
      state: 'pending',
    });
    expect(typeof cuerpo?.reference_id).toBe('number');
    expect(typeof cuerpo?.amount).toBe('number');
  });

  it('should load the payment in edit mode, lock state and leave it out of the body', async () => {
    const { fixture, componente } = await crear();
    let cuerpo: PayCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    fixture.componentRef.setInput('pay', PAGO);
    await fixture.whenStable();

    expect(componente.form.controls.reference_id.value).toBe(2);
    expect(componente.form.controls.amount.value).toBe(85000);
    expect(componente.form.controls.state.disabled).toBe(true);

    componente.submit();

    expect(cuerpo).toEqual({
      reference_type: 'appointment',
      reference_id: 2,
      method: 'Tarjeta',
      amount: 85000,
      date: '2026-10-05T09:35:00.000Z',
    });
    expect('state' in (cuerpo as object)).toBe(false);
  });

  it('should reset the form when resetKey changes', async () => {
    const { fixture, componente } = await crear();

    componente.form.patchValue({ method: 'Texto de una apertura anterior' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(componente.form.controls.method.value).toBe('');
  });
});
