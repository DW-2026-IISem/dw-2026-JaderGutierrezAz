import { TestBed } from '@angular/core/testing';
import { AccessPayload, EffectivePermission, SessionTokens } from '../models/auth.model';
import { User } from '../models/user.model';
import { SessionStore } from './session-store';

const TOKENS: SessionTokens = {
  access_token: 'acceso',
  token_type: 'Bearer',
  expires_in: 900,
  refresh_token: 'refresco',
  refresh_expires_in: 604799,
};

const USUARIO = { id: 2, username: 'seller', email: 'seller@huellavet.local', avatar: null, status: 'active' } as User;

const PERMISOS: EffectivePermission[] = [
  { resource_id: 1, method: 'GET', path: '/api/propietarios', description: 'Listar propietario', role_id: 2, role_name: 'RECEPCIONISTA' },
  { resource_id: 2, method: 'GET', path: '/api/propietarios/:id', description: 'Consultar propietario', role_id: 2, role_name: 'RECEPCIONISTA' },
  { resource_id: 24, method: 'POST', path: '/api/citas', description: 'Crear cita', role_id: 2, role_name: 'RECEPCIONISTA' },
];

const ACCESO: AccessPayload = { user: USUARIO, permissions: PERMISOS };

describe('SessionStore', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  function crear(): SessionStore {
    TestBed.resetTestingModule();
    return TestBed.inject(SessionStore);
  }

  it('should start without a session', () => {
    const session = crear();

    expect(session.isAuthenticated()).toBe(false);
    expect(session.user()).toBeNull();
    expect(session.permissionCount()).toBe(0);
  });

  it('should be authenticated after receiving tokens', () => {
    const session = crear();

    session.setTokens(TOKENS);

    expect(session.isAuthenticated()).toBe(true);
    expect(session.accessToken()).toBe('acceso');
    expect(session.refreshToken()).toBe('refresco');
  });

  it('should allow only granted permissions and match :id patterns', () => {
    const session = crear();
    session.setAccess(ACCESO);

    expect(session.can('GET', '/api/propietarios')).toBe(true);
    expect(session.can('GET', '/api/propietarios/7')).toBe(true);
    expect(session.can('get', '/api/propietarios?x=1')).toBe(true);
    expect(session.can('DELETE', '/api/propietarios/7')).toBe(false);
    expect(session.can('GET', '/api/pagos')).toBe(false);
    expect(session.canPermission('POST /api/citas')).toBe(true);
    expect(session.canPermission('POST /api/pagos')).toBe(false);
    expect(session.canPermission('sin-espacio')).toBe(false);
  });

  it('should derive roles and resources from the effective permissions', () => {
    const session = crear();
    session.setAccess(ACCESO);

    expect(session.roleNames()).toEqual(['RECEPCIONISTA']);
    expect(session.roles().length).toBe(1);
    expect(session.resources().length).toBe(3);
    expect(session.permissionCount()).toBe(3);
    expect(session.hasRole('recepcionista')).toBe(true);
  });

  it('should restore the session from localStorage in a new instance', () => {
    const primera = crear();
    primera.setTokens(TOKENS);
    primera.setAccess(ACCESO);

    const segunda = crear();

    expect(segunda.isAuthenticated()).toBe(true);
    expect(segunda.user()?.username).toBe('seller');
    expect(segunda.permissionCount()).toBe(3);
  });

  it('should clear memory and storage', () => {
    const session = crear();
    session.setTokens(TOKENS);
    session.setAccess(ACCESO);

    session.clear();

    expect(session.isAuthenticated()).toBe(false);
    expect(session.permissionCount()).toBe(0);
    expect(localStorage.getItem('storelab.session.v1')).toBeNull();
  });

  it('should discard a stored session written by an older shape', () => {
    localStorage.setItem('storelab.session.v1', JSON.stringify({ accessToken: 'x', roles: [] }));

    const session = crear();

    expect(session.isAuthenticated()).toBe(false);
  });
});
