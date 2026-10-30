import { TestBed } from '@angular/core/testing';
import { Veterinarian, VeterinarianCreate } from '../../../core/models/veterinarian.model';
import { VeterinarianForm } from './veterinarian-form';

const VETERINARIO: Veterinarian = {
  id: 1,
  name: 'Dra. Laura Gómez',
  description: 'Cirugía',
  is_active: true,
};

describe('VeterinarianForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [VeterinarianForm] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(VeterinarianForm);
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
    const emitidos: VeterinarianCreate[] = [];
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
    let cuerpo: VeterinarianCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.setValue({ name: ' Dr. Pedro Ruiz ', description: ' Dermatología ', is_active: true });
    componente.submit();

    expect(cuerpo).toEqual({
      name: 'Dr. Pedro Ruiz',
      description: 'Dermatología',
      is_active: true,
    });
  });

  it('should send an empty description as null', async () => {
    const { componente } = await crear();
    let cuerpo: VeterinarianCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.patchValue({ name: 'Sin descripción' });
    componente.submit();

    expect(cuerpo?.description).toBeNull();
  });

  it('should load the veterinarian in edit mode, lock is_active and leave it out of the body', async () => {
    const { fixture, componente } = await crear();
    let cuerpo: VeterinarianCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    fixture.componentRef.setInput('veterinarian', VETERINARIO);
    await fixture.whenStable();

    expect(componente.form.controls.name.value).toBe('Dra. Laura Gómez');
    expect(componente.form.controls.is_active.disabled).toBe(true);

    componente.submit();

    expect(cuerpo).toEqual({ name: 'Dra. Laura Gómez', description: 'Cirugía' });
  });

  it('should reset the form when resetKey changes', async () => {
    const { fixture, componente } = await crear();

    componente.form.patchValue({ name: 'Texto de una apertura anterior' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(componente.form.controls.name.value).toBe('');
  });
});
