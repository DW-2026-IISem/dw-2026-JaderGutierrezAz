import { TestBed } from '@angular/core/testing';
import {
  VaccineApplication,
  VaccineApplicationCreate,
} from '../../../core/models/vaccine-application.model';
import { VaccineApplicationForm } from './vaccine-application-form';

const APLICACION: VaccineApplication = {
  id: 5,
  consultation_id: 2,
  vaccine_batch_id: 3,
  name: 'Refuerzo anual',
  description: 'Sin reacción',
  is_active: true,
};

describe('VaccineApplicationForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VaccineApplicationForm] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(VaccineApplicationForm);
    fixture.componentRef.setInput('consultationOptions', [
      { id: 1, label: '#1 · Consulta general' },
      { id: 2, label: '#2 · Urgencia' },
    ]);
    fixture.componentRef.setInput('batchOptions', [
      { id: 1, label: 'Lote A-001 · Antirrábica' },
      { id: 3, label: 'Lote C-003 · Polivalente' },
    ]);
    await fixture.whenStable();
    return { fixture, componente: fixture.componentInstance };
  }

  it('should start empty, in creation mode and invalid', async () => {
    const { componente } = await crear();

    expect(componente.form.controls.consultation_id.value).toBeNull();
    expect(componente.form.controls.vaccine_batch_id.value).toBeNull();
    expect(componente.form.controls.is_active.disabled).toBe(false);
    expect(componente.form.invalid).toBe(true);
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { componente } = await crear();
    const emitidos: VaccineApplicationCreate[] = [];
    componente.saved.subscribe((cuerpo) => emitidos.push(cuerpo));

    componente.submit();

    expect(emitidos).toEqual([]);
    expect(componente.form.controls.consultation_id.touched).toBe(true);
    expect(componente.form.controls.vaccine_batch_id.touched).toBe(true);
    expect(componente.form.controls.name.touched).toBe(true);
  });

  it('should require both relations even when the name is valid', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ name: 'Primera dosis', consultation_id: 1 });
    expect(componente.form.controls.vaccine_batch_id.invalid).toBe(true);
    expect(componente.form.invalid).toBe(true);

    componente.form.patchValue({ vaccine_batch_id: 1 });
    expect(componente.form.valid).toBe(true);
  });

  it('should reject a name made only of spaces', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ consultation_id: 1, vaccine_batch_id: 1, name: '   ' });

    expect(componente.form.controls.name.invalid).toBe(true);
  });

  it('should emit the trimmed body with numeric ids and is_active when creating', async () => {
    const { componente } = await crear();
    let cuerpo: VaccineApplicationCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.setValue({
      consultation_id: 1,
      vaccine_batch_id: 3,
      name: ' Primera dosis ',
      description: ' Vía subcutánea ',
      is_active: true,
    });
    componente.submit();

    expect(cuerpo).toEqual({
      consultation_id: 1,
      vaccine_batch_id: 3,
      name: 'Primera dosis',
      description: 'Vía subcutánea',
      is_active: true,
    });
    expect(typeof cuerpo?.consultation_id).toBe('number');
    expect(typeof cuerpo?.vaccine_batch_id).toBe('number');
  });

  it('should send an empty description as null', async () => {
    const { componente } = await crear();
    let cuerpo: VaccineApplicationCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.patchValue({ consultation_id: 1, vaccine_batch_id: 1, name: 'Sin descripción' });
    componente.submit();

    expect(cuerpo?.description).toBeNull();
  });

  it('should load the application in edit mode, lock is_active and leave it out of the body', async () => {
    const { fixture, componente } = await crear();
    let cuerpo: VaccineApplicationCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    fixture.componentRef.setInput('application', APLICACION);
    await fixture.whenStable();

    expect(componente.form.controls.consultation_id.value).toBe(2);
    expect(componente.form.controls.vaccine_batch_id.value).toBe(3);
    expect(componente.form.controls.is_active.disabled).toBe(true);

    componente.submit();

    expect(cuerpo).toEqual({
      consultation_id: 2,
      vaccine_batch_id: 3,
      name: 'Refuerzo anual',
      description: 'Sin reacción',
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
