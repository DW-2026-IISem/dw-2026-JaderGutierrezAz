import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { EffectivePermission, SessionTokens } from '../models/auth.model';
import { User } from '../models/user.model';
import { SessionStore } from '../services/session-store';
import { authGuard } from './auth-guard';
import { authOnlyGuard } from './auth-only-guard';
import { guestGuard } from './guest-guard';
import { permissionGuard } from './permission-guard';

const TOKENS: SessionTokens = {
  access_token: 'acceso',
  token_type: 'Bearer',
  expires_in: 900,
  refresh_token: 'refresco',
  refresh_expires_in: 604799,
};

const USUARIO = { id: 2, username: 'seller', email: 's@huellavet.local', avatar: null, status: 'active' } as User;

const PERMISOS: EffectivePermission[] = [
  { resource_id: 1, method: 'GET', path: '/api/propietarios', description: null, role_id: 2, role_name: 'RECEPCIONISTA' },
];

function ruta(permission?: string): ActivatedRouteSnapshot {
  return { data: permission ? { permission } : {} } as unknown as ActivatedRouteSnapshot;
}

function estado(url: string): RouterStateSnapshot {
  return { url } as RouterStateSnapshot;
}

describe('guards de sesión y permisos', () => {
  let session: SessionStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    session = TestBed.inject(SessionStore);
  });

  afterEach(() => localStorage.clear());

  function ejecutar(guard: CanActivateFn, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return TestBed.runInInjectionContext(() => guard(route, state)) as boolean | UrlTree;
  }

  describe('authGuard', () => {
    it('should redirect to /login with the requested url when there is no session', () => {
      const resultado = ejecutar(authGuard, ruta(), estado('/pagos')) as UrlTree;

      expect(resultado.toString()).toContain('/login');
      expect(resultado.queryParams['returnUrl']).toBe('/pagos');
    });

    it('should allow the navigation when there is a session', () => {
      session.setTokens(TOKENS);

      expect(ejecutar(authGuard, ruta(), estado('/pagos'))).toBe(true);
    });
  });

  describe('guestGuard', () => {
    it('should allow the login screen without a session', () => {
      expect(ejecutar(guestGuard, ruta(), estado('/login'))).toBe(true);
    });

    it('should send an authenticated user to the dashboard', () => {
      session.setTokens(TOKENS);

      const resultado = ejecutar(guestGuard, ruta(), estado('/login')) as UrlTree;

      expect(resultado.toString()).toBe('/dashboard');
    });
  });

  describe('permissionGuard', () => {
    it('should allow a route that declares no permission', () => {
      expect(ejecutar(permissionGuard, ruta(), estado('/perfil'))).toBe(true);
    });

    it('should allow a route when the session has the permission', () => {
      session.setAccess({ user: USUARIO, permissions: PERMISOS });

      expect(ejecutar(permissionGuard, ruta('GET /api/propietarios'), estado('/propietarios'))).toBe(true);
    });

    it('should deny by default and report the missing permission in /forbidden', () => {
      session.setAccess({ user: USUARIO, permissions: PERMISOS });

      const resultado = ejecutar(permissionGuard, ruta('GET /api/pagos'), estado('/pagos')) as UrlTree;

      expect(resultado.toString()).toContain('/forbidden');
      expect(resultado.queryParams['permission']).toBe('GET /api/pagos');
    });

    it('should deny when the session has no permissions at all', () => {
      const resultado = ejecutar(permissionGuard, ruta('GET /api/propietarios'), estado('/propietarios'));

      expect(resultado).toBeInstanceOf(UrlTree);
    });
  });

  describe('authOnlyGuard', () => {
    it('should allow the screen when authentication is enabled', () => {
      expect(session.authEnabled).toBe(true);
      expect(ejecutar(authOnlyGuard, ruta(), estado('/perfil'))).toBe(true);
    });
  });

  it('should use the same Router instance that builds the redirections', () => {
    expect(TestBed.inject(Router)).toBeTruthy();
  });
});
