import { TestBed } from '@angular/core/testing';
import { Role, RoleCreate } from '../../../../core/models/role.model';
import { RoleForm } from './role-form';

const ROL: Role = {
  id: 2,
  name: 'RECEPCIONISTA',
  description: 'Atiende la recepción',
  status: 'active',
};

describe('RoleForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RoleForm] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(RoleForm);
    await fixture.whenStable();
    return { fixture, componente: fixture.componentInstance };
  }

  it('should start empty, in creation mode and invalid', async () => {
    const { componente } = await crear();

    expect(componente.form.controls.name.value).toBe('');
    expect(componente.form.controls.status.disabled).toBe(false);
    expect(componente.form.invalid).toBe(true);
  });

  it('should reject a name of only spaces and one longer than 60 characters', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ name: '   ' });
    expect(componente.form.controls.name.invalid).toBe(true);

    componente.form.patchValue({ name: 'X'.repeat(61) });
    expect(componente.form.controls.name.invalid).toBe(true);
  });

  it('should emit the trimmed body with status when creating and an empty description as null', async () => {
    const { componente } = await crear();
    let cuerpo: RoleCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.patchValue({ name: ' VETERINARIO ' });
    componente.submit();

    expect(cuerpo).toEqual({ name: 'VETERINARIO', description: null, status: 'active' });
  });

  it('should load the role in edit mode, lock status and leave it out of the body', async () => {
    const { fixture, componente } = await crear();
    let cuerpo: RoleCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    fixture.componentRef.setInput('role', ROL);
    await fixture.whenStable();

    expect(componente.form.controls.name.value).toBe('RECEPCIONISTA');
    expect(componente.form.controls.status.disabled).toBe(true);

    componente.submit();

    expect(cuerpo).toEqual({ name: 'RECEPCIONISTA', description: 'Atiende la recepción' });
    expect('status' in (cuerpo as object)).toBe(false);
  });

  it('should reset the form when resetKey changes', async () => {
    const { fixture, componente } = await crear();

    componente.form.patchValue({ name: 'TEXTO ANTERIOR' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(componente.form.controls.name.value).toBe('');
  });
});
