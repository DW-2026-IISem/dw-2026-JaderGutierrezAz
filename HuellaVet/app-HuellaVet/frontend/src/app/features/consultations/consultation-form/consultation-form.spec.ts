import { TestBed } from '@angular/core/testing';
import { Consultation, ConsultationCreate } from '../../../core/models/consultation.model';
import { ConsultationForm } from './consultation-form';

const CONSULTA: Consultation = {
  id: 4,
  appointment_id: 2,
  name: 'Consulta general',
  description: 'Sin hallazgos',
  is_active: true,
};

describe('ConsultationForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ConsultationForm] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(ConsultationForm);
    fixture.componentRef.setInput('appointmentOptions', [
      { id: 1, label: '#1 · cita' },
      { id: 2, label: '#2 · cita' },
    ]);
    await fixture.whenStable();
    return { fixture, componente: fixture.componentInstance };
  }

  it('should start empty, in creation mode and invalid', async () => {
    const { componente } = await crear();

    expect(componente.form.controls.appointment_id.value).toBeNull();
    expect(componente.form.controls.name.value).toBe('');
    expect(componente.form.controls.is_active.disabled).toBe(false);
    expect(componente.form.invalid).toBe(true);
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { componente } = await crear();
    const emitidos: ConsultationCreate[] = [];
    componente.saved.subscribe((cuerpo) => emitidos.push(cuerpo));

    componente.submit();

    expect(emitidos).toEqual([]);
    expect(componente.form.controls.appointment_id.touched).toBe(true);
    expect(componente.form.controls.name.touched).toBe(true);
  });

  it('should require an appointment even when the name is valid', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ name: 'Consulta' });
    expect(componente.form.controls.appointment_id.invalid).toBe(true);

    componente.form.patchValue({ appointment_id: 1 });
    expect(componente.form.valid).toBe(true);
  });

  it('should reject a name made only of spaces', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ appointment_id: 1, name: '   ' });

    expect(componente.form.controls.name.invalid).toBe(true);
  });

  it('should emit the trimmed body with a numeric appointment_id and is_active when creating', async () => {
    const { componente } = await crear();
    let cuerpo: ConsultationCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.setValue({
      appointment_id: 1,
      name: ' Consulta general ',
      description: ' Sin hallazgos ',
      is_active: true,
    });
    componente.submit();

    expect(cuerpo).toEqual({
      appointment_id: 1,
      name: 'Consulta general',
      description: 'Sin hallazgos',
      is_active: true,
    });
    expect(typeof cuerpo?.appointment_id).toBe('number');
  });

  it('should send an empty description as null', async () => {
    const { componente } = await crear();
    let cuerpo: ConsultationCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.patchValue({ appointment_id: 1, name: 'Consulta' });
    componente.submit();

    expect(cuerpo?.description).toBeNull();
  });

  it('should load the consultation in edit mode, lock is_active and leave it out of the body', async () => {
    const { fixture, componente } = await crear();
    let cuerpo: ConsultationCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    fixture.componentRef.setInput('consultation', CONSULTA);
    await fixture.whenStable();

    expect(componente.form.controls.appointment_id.value).toBe(2);
    expect(componente.form.controls.is_active.disabled).toBe(true);

    componente.submit();

    expect(cuerpo).toEqual({
      appointment_id: 2,
      name: 'Consulta general',
      description: 'Sin hallazgos',
    });
  });

  it('should reset the form when resetKey changes', async () => {
    const { fixture, componente } = await crear();

    componente.form.patchValue({ name: 'Texto de una apertura anterior' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(componente.form.controls.name.value).toBe('');
  });
});
