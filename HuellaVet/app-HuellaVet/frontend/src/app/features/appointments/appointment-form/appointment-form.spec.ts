import { TestBed } from '@angular/core/testing';
import { Appointment, AppointmentCreate } from '../../../core/models/appointment.model';
import { AppointmentForm } from './appointment-form';

const CITA: Appointment = {
  id: 5,
  pet_id: 2,
  veterinarian_id: 3,
  start_date: '2030-01-15T14:00:00.000Z',
  end_date: '2030-01-15T15:00:00.000Z',
  reason: 'Control',
  state: 'scheduled',
};

const INICIO = new Date(2030, 0, 15, 9, 0);
const FIN = new Date(2030, 0, 15, 10, 0);

describe('AppointmentForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AppointmentForm] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(AppointmentForm);
    fixture.componentRef.setInput('petOptions', [{ id: 1, label: 'Firulais · Ana' }]);
    fixture.componentRef.setInput('vetOptions', [{ id: 1, label: 'Dra. Laura' }]);
    await fixture.whenStable();
    return { fixture, componente: fixture.componentInstance };
  }

  it('should start empty, in scheduled state and invalid', async () => {
    const { componente } = await crear();

    expect(componente.form.controls.pet_id.value).toBeNull();
    expect(componente.form.controls.state.value).toBe('scheduled');
    expect(componente.form.invalid).toBe(true);
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { componente } = await crear();
    const emitidos: AppointmentCreate[] = [];
    componente.saved.subscribe((cuerpo) => emitidos.push(cuerpo));

    componente.submit();

    expect(emitidos).toEqual([]);
    expect(componente.form.controls.pet_id.touched).toBe(true);
    expect(componente.form.controls.reason.touched).toBe(true);
  });

  it('should require pet, veterinarian, both dates and a reason', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ pet_id: 1, veterinarian_id: 1, reason: 'Control' });
    expect(componente.form.invalid).toBe(true);

    componente.form.patchValue({ start_date: INICIO, end_date: FIN });
    expect(componente.form.valid).toBe(true);
  });

  it('should reject an end date that is not after the start date', async () => {
    const { componente } = await crear();

    componente.form.patchValue({
      pet_id: 1,
      veterinarian_id: 1,
      reason: 'Control',
      start_date: FIN,
      end_date: INICIO,
    });

    expect(componente.form.hasError('endBeforeStart')).toBe(true);
    expect(componente.form.invalid).toBe(true);
  });

  it('should emit numeric ids, ISO dates, the trimmed reason and the state', async () => {
    const { componente } = await crear();
    let cuerpo: AppointmentCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.setValue({
      pet_id: 1,
      veterinarian_id: 1,
      start_date: INICIO,
      end_date: FIN,
      reason: ' Control anual ',
      state: 'scheduled',
    });
    componente.submit();

    expect(cuerpo).toEqual({
      pet_id: 1,
      veterinarian_id: 1,
      start_date: INICIO.toISOString(),
      end_date: FIN.toISOString(),
      reason: 'Control anual',
      state: 'scheduled',
    });
    expect(typeof cuerpo?.pet_id).toBe('number');
  });

  it('should load the appointment in edit mode and emit its state in the body', async () => {
    const { fixture, componente } = await crear();
    let cuerpo: AppointmentCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    fixture.componentRef.setInput('appointment', CITA);
    await fixture.whenStable();

    expect(componente.form.controls.pet_id.value).toBe(2);
    expect(componente.form.controls.state.enabled).toBe(true);

    componente.form.patchValue({ state: 'completed' });
    componente.submit();

    expect(cuerpo?.state).toBe('completed');
    expect(cuerpo?.start_date).toBe('2030-01-15T14:00:00.000Z');
  });

  it('should reset the form when resetKey changes', async () => {
    const { fixture, componente } = await crear();

    componente.form.patchValue({ reason: 'Texto de una apertura anterior' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(componente.form.controls.reason.value).toBe('');
  });
});
