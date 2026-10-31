import { TestBed } from '@angular/core/testing';
import { Vaccine, VaccineCreate } from '../../../core/models/vaccine.model';
import { VaccineForm } from './vaccine-form';

const VACUNA: Vaccine = {
  id: 1,
  name: 'Antirrábica',
  description: 'Refuerzo anual',
  is_active: true,
};

describe('VaccineForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VaccineForm] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(VaccineForm);
    await fixture.whenStable();
    return { fixture, componente: fixture.componentInstance };
  }

  it('should start empty, in creation mode and invalid', async () => {
    const { componente } = await crear();

    expect(componente.form.controls.name.value).toBe('');
    expect(componente.form.controls.is_active.disabled).toBe(false);
    expect(componente.form.invalid).toBe(true);
  });

  it('should not emit and should mark the name as touched when it is invalid', async () => {
    const { componente } = await crear();
    const emitidos: VaccineCreate[] = [];
    componente.saved.subscribe((cuerpo) => emitidos.push(cuerpo));

    componente.submit();

    expect(emitidos).toEqual([]);
    expect(componente.form.controls.name.touched).toBe(true);
  });

  it('should reject a name made only of spaces', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ name: '   ' });

    expect(componente.form.controls.name.invalid).toBe(true);
  });

  it('should emit the trimmed body with is_active when creating', async () => {
    const { componente } = await crear();
    let cuerpo: VaccineCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.setValue({ name: ' Polivalente ', description: ' Perros adultos ', is_active: true });
    componente.submit();

    expect(cuerpo).toEqual({
      name: 'Polivalente',
      description: 'Perros adultos',
      is_active: true,
    });
  });

  it('should send an empty description as null', async () => {
    const { componente } = await crear();
    let cuerpo: VaccineCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.patchValue({ name: 'Sin descripción' });
    componente.submit();

    expect(cuerpo?.description).toBeNull();
  });

  it('should load the vaccine in edit mode, lock is_active and leave it out of the body', async () => {
    const { fixture, componente } = await crear();
    let cuerpo: VaccineCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    fixture.componentRef.setInput('vaccine', VACUNA);
    await fixture.whenStable();

    expect(componente.form.controls.name.value).toBe('Antirrábica');
    expect(componente.form.controls.is_active.disabled).toBe(true);

    componente.submit();

    expect(cuerpo).toEqual({ name: 'Antirrábica', description: 'Refuerzo anual' });
  });

  it('should reset the form when resetKey changes', async () => {
    const { fixture, componente } = await crear();

    componente.form.patchValue({ name: 'Texto de una apertura anterior' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(componente.form.controls.name.value).toBe('');
  });
});
