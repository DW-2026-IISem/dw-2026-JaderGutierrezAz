import { TestBed } from '@angular/core/testing';
import { Owner, OwnerCreate } from '../../../core/models/owner.model';
import { OwnerForm } from './owner-form';

const PROPIETARIO: Owner = {
  id: 1,
  document_type: 'CC',
  document_number: '1001',
  name: 'Ana Pérez',
  phone: '3001112233',
  email: 'ana@correo.com',
  is_active: true,
};

describe('OwnerForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OwnerForm] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(OwnerForm);
    await fixture.whenStable();
    return { fixture, componente: fixture.componentInstance };
  }

  it('should start empty, in creation mode and invalid', async () => {
    const { componente } = await crear();

    expect(componente.form.controls.document_type.value).toBe('CC');
    expect(componente.form.controls.name.value).toBe('');
    expect(componente.form.controls.is_active.disabled).toBe(false);
    expect(componente.form.invalid).toBe(true);
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { componente } = await crear();
    const emitidos: OwnerCreate[] = [];
    componente.saved.subscribe((cuerpo) => emitidos.push(cuerpo));

    componente.submit();

    expect(emitidos).toEqual([]);
    expect(componente.form.controls.name.touched).toBe(true);
    expect(componente.form.controls.document_number.touched).toBe(true);
  });

  it('should reject a name made only of spaces', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ document_number: '1001', name: '   ' });

    expect(componente.form.controls.name.invalid).toBe(true);
  });

  it('should emit the trimmed body with is_active when creating', async () => {
    const { componente } = await crear();
    let cuerpo: OwnerCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.setValue({
      document_type: 'CE',
      document_number: '2002',
      name: 'Luis Gómez',
      phone: '3100000000',
      email: 'luis@correo.com',
      is_active: true,
    });
    componente.submit();

    expect(cuerpo).toEqual({
      document_type: 'CE',
      document_number: '2002',
      name: 'Luis Gómez',
      phone: '3100000000',
      email: 'luis@correo.com',
      is_active: true,
    });
  });

  it('should send an empty phone and email as null', async () => {
    const { componente } = await crear();
    let cuerpo: OwnerCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.patchValue({ document_number: '3003', name: 'Sin contacto' });
    componente.submit();

    expect(cuerpo?.phone).toBeNull();
    expect(cuerpo?.email).toBeNull();
  });

  it('should load the owner in edit mode, lock is_active and leave it out of the body', async () => {
    const { fixture, componente } = await crear();
    let cuerpo: OwnerCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    fixture.componentRef.setInput('owner', PROPIETARIO);
    await fixture.whenStable();

    expect(componente.form.controls.name.value).toBe('Ana Pérez');
    expect(componente.form.controls.is_active.disabled).toBe(true);

    componente.submit();

    expect(cuerpo).toEqual({
      document_type: 'CC',
      document_number: '1001',
      name: 'Ana Pérez',
      phone: '3001112233',
      email: 'ana@correo.com',
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
