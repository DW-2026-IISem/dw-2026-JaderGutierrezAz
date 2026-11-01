import { TestBed } from '@angular/core/testing';
import { Vaccine } from '../../../core/models/vaccine.model';
import { VaccineBatch, VaccineBatchCreate } from '../../../core/models/vaccine-batch.model';
import { VaccineBatchForm } from './vaccine-batch-form';

const VACUNAS: Vaccine[] = [
  { id: 1, name: 'Antirrábica', description: null, is_active: true },
  { id: 2, name: 'Polivalente', description: null, is_active: true },
];

const LOTE: VaccineBatch = {
  id: 5,
  vaccine_id: 2,
  name: 'Lote B-002',
  description: 'Vence 2027',
  is_active: true,
};

describe('VaccineBatchForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VaccineBatchForm] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(VaccineBatchForm);
    fixture.componentRef.setInput('vaccines', VACUNAS);
    await fixture.whenStable();
    return { fixture, componente: fixture.componentInstance };
  }

  it('should start empty, in creation mode and invalid', async () => {
    const { componente } = await crear();

    expect(componente.form.controls.vaccine_id.value).toBeNull();
    expect(componente.form.controls.name.value).toBe('');
    expect(componente.form.controls.is_active.disabled).toBe(false);
    expect(componente.form.invalid).toBe(true);
  });

  it('should label each vaccine option with its name', async () => {
    const { componente } = await crear();

    expect(componente.vaccineOptions()).toEqual([
      { id: 1, label: 'Antirrábica' },
      { id: 2, label: 'Polivalente' },
    ]);
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { componente } = await crear();
    const emitidos: VaccineBatchCreate[] = [];
    componente.saved.subscribe((cuerpo) => emitidos.push(cuerpo));

    componente.submit();

    expect(emitidos).toEqual([]);
    expect(componente.form.controls.vaccine_id.touched).toBe(true);
    expect(componente.form.controls.name.touched).toBe(true);
  });

  it('should require a vaccine even when the name is valid', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ name: 'Lote A-001' });
    expect(componente.form.controls.vaccine_id.invalid).toBe(true);

    componente.form.patchValue({ vaccine_id: 1 });
    expect(componente.form.valid).toBe(true);
  });

  it('should reject a name made only of spaces', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ vaccine_id: 1, name: '   ' });

    expect(componente.form.controls.name.invalid).toBe(true);
  });

  it('should emit the trimmed body with a numeric vaccine_id and is_active when creating', async () => {
    const { componente } = await crear();
    let cuerpo: VaccineBatchCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.setValue({
      vaccine_id: 1,
      name: ' Lote A-001 ',
      description: ' Vence 2027 ',
      is_active: true,
    });
    componente.submit();

    expect(cuerpo).toEqual({
      vaccine_id: 1,
      name: 'Lote A-001',
      description: 'Vence 2027',
      is_active: true,
    });
    expect(typeof cuerpo?.vaccine_id).toBe('number');
  });

  it('should send an empty description as null', async () => {
    const { componente } = await crear();
    let cuerpo: VaccineBatchCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.patchValue({ vaccine_id: 1, name: 'Lote sin descripción' });
    componente.submit();

    expect(cuerpo?.description).toBeNull();
  });

  it('should load the batch in edit mode, lock is_active and leave it out of the body', async () => {
    const { fixture, componente } = await crear();
    let cuerpo: VaccineBatchCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    fixture.componentRef.setInput('batch', LOTE);
    await fixture.whenStable();

    expect(componente.form.controls.vaccine_id.value).toBe(2);
    expect(componente.form.controls.is_active.disabled).toBe(true);

    componente.submit();

    expect(cuerpo).toEqual({ vaccine_id: 2, name: 'Lote B-002', description: 'Vence 2027' });
  });

  it('should reset the form when resetKey changes', async () => {
    const { fixture, componente } = await crear();

    componente.form.patchValue({ name: 'Texto de una apertura anterior' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(componente.form.controls.name.value).toBe('');
  });
});
