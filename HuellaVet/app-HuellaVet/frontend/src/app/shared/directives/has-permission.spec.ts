import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectivePermission } from '../../core/models/auth.model';
import { User } from '../../core/models/user.model';
import { SessionStore } from '../../core/services/session-store';
import { HasPermission } from './has-permission';

@Component({
  imports: [HasPermission],
  template: `
    <ng-container *appHasPermission="'POST /api/pagos'">
      <button id="crear">Nuevo pago</button>
    </ng-container>
    <ng-container *appHasPermission="'PATCH /api/pagos/:id'">
      <button id="editar">Editar</button>
    </ng-container>
  `,
})
class Anfitrion {}

const USUARIO = { id: 1, username: 'admin', email: 'a@huellavet.local', avatar: null, status: 'active' } as User;

function permiso(method: EffectivePermission['method'], path: string): EffectivePermission {
  return { resource_id: 1, method, path, description: null, role_id: 1, role_name: 'ADMIN' };
}

describe('HasPermission', () => {
  let session: SessionStore;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [Anfitrion] }).compileComponents();
    session = TestBed.inject(SessionStore);
  });

  afterEach(() => localStorage.clear());

  async function crear() {
    const fixture = TestBed.createComponent(Anfitrion);
    await fixture.whenStable();
    return { fixture, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should not render the content when the permission is missing', async () => {
    const { compilado } = await crear();

    expect(compilado.querySelector('#crear')).toBeNull();
    expect(compilado.querySelector('#editar')).toBeNull();
  });

  it('should render only the content whose permission is granted', async () => {
    session.setAccess({ user: USUARIO, permissions: [permiso('POST', '/api/pagos')] });

    const { compilado } = await crear();

    expect(compilado.querySelector('#crear')).toBeTruthy();
    expect(compilado.querySelector('#editar')).toBeNull();
  });

  it('should match a path pattern with :id', async () => {
    session.setAccess({ user: USUARIO, permissions: [permiso('PATCH', '/api/pagos/:id')] });

    const { compilado } = await crear();

    expect(compilado.querySelector('#editar')).toBeTruthy();
  });

  it('should react when the permissions change without recreating the component', async () => {
    const { fixture, compilado } = await crear();
    expect(compilado.querySelector('#crear')).toBeNull();

    session.setAccess({ user: USUARIO, permissions: [permiso('POST', '/api/pagos')] });
    await fixture.whenStable();
    expect(compilado.querySelector('#crear')).toBeTruthy();

    session.clear();
    await fixture.whenStable();
    expect(compilado.querySelector('#crear')).toBeNull();
  });
});
