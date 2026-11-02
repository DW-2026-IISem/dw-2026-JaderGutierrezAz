import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SessionTokens } from '../models/auth.model';
import { SessionStore } from '../services/session-store';
import { authInterceptor } from './auth-interceptor';

const URL = `${environment.apiUrl}/propietarios`;
const LOGIN = `${environment.apiUrl}/sesion/login`;
const REFRESH = `${environment.apiUrl}/sesion/refresh`;

const VIEJOS: SessionTokens = {
  access_token: 'viejo',
  token_type: 'Bearer',
  expires_in: 900,
  refresh_token: 'r1',
  refresh_expires_in: 604799,
};

const NUEVOS: SessionTokens = { ...VIEJOS, access_token: 'nuevo', refresh_token: 'r2' };

const NO_AUTORIZADO = { status: 401, statusText: 'Unauthorized' };

describe('authInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let session: SessionStore;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([{ path: 'login', children: [] }]),
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
    session = TestBed.inject(SessionStore);
  });

  afterEach(() => {
    ctrl.verify();
    localStorage.clear();
  });

  it('should add the Bearer header to protected requests', () => {
    session.setTokens(VIEJOS);

    http.get(URL).subscribe();

    const peticion = ctrl.expectOne(URL);
    expect(peticion.request.headers.get('Authorization')).toBe('Bearer viejo');
    peticion.flush({ owners: [] });
  });

  it('should not add the Bearer header to login', () => {
    session.setTokens(VIEJOS);

    http.post(LOGIN, {}).subscribe();

    const peticion = ctrl.expectOne(LOGIN);
    expect(peticion.request.headers.has('Authorization')).toBe(false);
    peticion.flush({});
  });

  it('should refresh only once when two requests get a 401 and retry both with the new token', () => {
    session.setTokens(VIEJOS);
    const resultados: unknown[] = [];

    http.get(URL).subscribe((r) => resultados.push(r));
    http.get(URL).subscribe((r) => resultados.push(r));

    const iniciales = ctrl.match(URL);
    expect(iniciales.length).toBe(2);
    iniciales.forEach((p) => p.flush({ error: 'Token expired' }, NO_AUTORIZADO));

    const refresco = ctrl.expectOne(REFRESH);
    expect(refresco.request.body).toEqual({ refresh_token: 'r1' });
    refresco.flush(NUEVOS);

    const reintentos = ctrl.match(URL);
    expect(reintentos.length).toBe(2);
    reintentos.forEach((p) => {
      expect(p.request.headers.get('Authorization')).toBe('Bearer nuevo');
      p.flush({ owners: [] });
    });

    expect(resultados.length).toBe(2);
    expect(session.refreshToken()).toBe('r2');
  });

  it('should clear the session and propagate the error when the refresh fails', () => {
    session.setTokens(VIEJOS);
    let fallo = false;

    http.get(URL).subscribe({ error: () => (fallo = true) });

    ctrl.expectOne(URL).flush({ error: 'Token expired' }, NO_AUTORIZADO);
    ctrl
      .expectOne(REFRESH)
      .flush({ error: 'Invalid refresh token' }, NO_AUTORIZADO);

    expect(fallo).toBe(true);
    expect(session.isAuthenticated()).toBe(false);
  });
});
