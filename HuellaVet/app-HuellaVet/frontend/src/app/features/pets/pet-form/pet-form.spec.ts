import { TestBed } from '@angular/core/testing';
import { Owner } from '../../../core/models/owner.model';
import { Pet, PetCreate } from '../../../core/models/pet.model';
import { PetForm } from './pet-form';

const PROPIETARIOS: Owner[] = [
  {
    id: 1,
    document_type: 'CC',
    document_number: '1001',
    name: 'Ana Pérez',
    phone: null,
    email: null,
    is_active: true,
  },
  {
    id: 2,
    document_type: 'CC',
    document_number: '2002',
    name: 'Luis Gómez',
    phone: null,
    email: null,
    is_active: true,
  },
];

const MASCOTA: Pet = {
  id: 5,
  owner_id: 2,
  name: 'Firulais',
  description: 'Labrador',
  is_active: true,
};

describe('PetForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PetForm] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(PetForm);
    fixture.componentRef.setInput('owners', PROPIETARIOS);
    await fixture.whenStable();
    return { fixture, componente: fixture.componentInstance };
  }

  it('should start empty, in creation mode and invalid', async () => {
    const { componente } = await crear();

    expect(componente.form.controls.owner_id.value).toBeNull();
    expect(componente.form.controls.name.value).toBe('');
    expect(componente.form.controls.is_active.disabled).toBe(false);
    expect(componente.form.invalid).toBe(true);
  });

  it('should label each owner option with the name and the document', async () => {
    const { componente } = await crear();

    expect(componente.ownerOptions()).toEqual([
      { id: 1, label: 'Ana Pérez · 1001' },
      { id: 2, label: 'Luis Gómez · 2002' },
    ]);
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { componente } = await crear();
    const emitidos: PetCreate[] = [];
    componente.saved.subscribe((cuerpo) => emitidos.push(cuerpo));

    componente.submit();

    expect(emitidos).toEqual([]);
    expect(componente.form.controls.owner_id.touched).toBe(true);
    expect(componente.form.controls.name.touched).toBe(true);
  });

  it('should require an owner even when the name is valid', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ name: 'Firulais' });
    expect(componente.form.controls.owner_id.invalid).toBe(true);

    componente.form.patchValue({ owner_id: 1 });
    expect(componente.form.valid).toBe(true);
  });

  it('should reject a name made only of spaces', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ owner_id: 1, name: '   ' });

    expect(componente.form.controls.name.invalid).toBe(true);
  });

  it('should emit the trimmed body with a numeric owner_id and is_active when creating', async () => {
    const { componente } = await crear();
    let cuerpo: PetCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.setValue({
      owner_id: 1,
      name: ' Firulais ',
      description: ' Labrador ',
      is_active: true,
    });
    componente.submit();

    expect(cuerpo).toEqual({
      owner_id: 1,
      name: 'Firulais',
      description: 'Labrador',
      is_active: true,
    });
    expect(typeof cuerpo?.owner_id).toBe('number');
  });

  it('should send an empty description as null', async () => {
    const { componente } = await crear();
    let cuerpo: PetCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.patchValue({ owner_id: 1, name: 'Michi' });
    componente.submit();

    expect(cuerpo?.description).toBeNull();
  });

  it('should load the pet in edit mode, lock is_active and leave it out of the body', async () => {
    const { fixture, componente } = await crear();
    let cuerpo: PetCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    fixture.componentRef.setInput('pet', MASCOTA);
    await fixture.whenStable();

    expect(componente.form.controls.owner_id.value).toBe(2);
    expect(componente.form.controls.is_active.disabled).toBe(true);

    componente.submit();

    expect(cuerpo).toEqual({ owner_id: 2, name: 'Firulais', description: 'Labrador' });
  });

  it('should reset the form when resetKey changes', async () => {
    const { fixture, componente } = await crear();

    componente.form.patchValue({ name: 'Texto de una apertura anterior' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(componente.form.controls.name.value).toBe('');
  });
});
