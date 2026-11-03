import { TestBed } from '@angular/core/testing';
import { User } from '../../../../core/models/user.model';
import { UserForm, UserFormValue } from './user-form';

const USUARIO: User = {
  id: 7,
  username: 'maria',
  email: 'maria@huellavet.local',
  avatar: 'Maria',
  status: 'active',
};

describe('UserForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UserForm] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(UserForm);
    await fixture.whenStable();
    return { fixture, componente: fixture.componentInstance };
  }

  it('should start empty, in creation mode and invalid', async () => {
    const { componente } = await crear();

    expect(componente.form.controls.username.value).toBe('');
    expect(componente.form.controls.password.disabled).toBe(false);
    expect(componente.form.controls.status.disabled).toBe(false);
    expect(componente.form.invalid).toBe(true);
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { componente } = await crear();
    const emitidos: UserFormValue[] = [];
    componente.saved.subscribe((cuerpo) => emitidos.push(cuerpo));

    componente.submit();

    expect(emitidos).toEqual([]);
    expect(componente.form.controls.username.touched).toBe(true);
    expect(componente.form.controls.email.touched).toBe(true);
  });

  it('should require a password of at least 8 characters when creating', async () => {
    const { componente } = await crear();
    componente.form.patchValue({ username: 'maria', email: 'maria@huellavet.local' });

    componente.form.patchValue({ password: 'abc' });
    expect(componente.form.controls.password.invalid).toBe(true);

    componente.form.patchValue({ password: 'Abcdefg1!' });
    expect(componente.form.valid).toBe(true);
  });

  it('should reject an invalid email and a username of only spaces', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ email: 'no-es-correo', username: '   ' });

    expect(componente.form.controls.email.invalid).toBe(true);
    expect(componente.form.controls.username.invalid).toBe(true);
  });

  it('should emit the trimmed body with password and status when creating', async () => {
    const { componente } = await crear();
    let cuerpo: UserFormValue | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.setValue({
      username: ' maria ',
      email: ' maria@huellavet.local ',
      password: 'Abcdefg1!',
      avatar: '',
      status: 'active',
    });
    componente.submit();

    expect(cuerpo).toEqual({
      username: 'maria',
      email: 'maria@huellavet.local',
      avatar: null,
      password: 'Abcdefg1!',
      status: 'active',
    });
  });

  it('should load the user in edit mode and leave password and status out of the body', async () => {
    const { fixture, componente } = await crear();
    let cuerpo: UserFormValue | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    fixture.componentRef.setInput('user', USUARIO);
    await fixture.whenStable();

    expect(componente.form.controls.username.value).toBe('maria');
    expect(componente.form.controls.password.disabled).toBe(true);
    expect(componente.form.controls.status.disabled).toBe(true);
    expect(componente.form.valid).toBe(true);

    componente.submit();

    expect(cuerpo).toEqual({ username: 'maria', email: 'maria@huellavet.local', avatar: 'Maria' });
    expect('password' in (cuerpo as object)).toBe(false);
    expect('status' in (cuerpo as object)).toBe(false);
  });

  it('should reset the form when resetKey changes', async () => {
    const { fixture, componente } = await crear();

    componente.form.patchValue({ username: 'texto de una apertura anterior' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(componente.form.controls.username.value).toBe('');
  });
});
