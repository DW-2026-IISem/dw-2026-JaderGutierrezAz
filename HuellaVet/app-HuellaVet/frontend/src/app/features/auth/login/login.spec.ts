import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AccessPayload } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth';
import { Login } from './login';

describe('Login', () => {
  const urls: string[] = [];
  const llamadas: { identifier: string; password: string }[] = [];

  async function crear(
    respuesta: Observable<AccessPayload>,
    returnUrl: string | null = null,
  ) {
    urls.length = 0;
    llamadas.length = 0;

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: (credenciales: { identifier: string; password: string }) => {
              llamadas.push(credenciales);
              return respuesta;
            },
          },
        },
        {
          provide: Router,
          useValue: {
            navigateByUrl: (url: string) => {
              urls.push(url);
              return Promise.resolve(true);
            },
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap(returnUrl ? { returnUrl } : {}) },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(Login);
    await fixture.whenStable();
    return fixture.componentInstance;
  }

  it('should not call the API when the form is invalid', async () => {
    const login = await crear(of({} as AccessPayload));

    login.submit();

    expect(llamadas).toEqual([]);
    expect(login.form.controls.identifier.touched).toBe(true);
    expect(login.form.controls.password.touched).toBe(true);
  });

  it('should send the credentials and go to the dashboard by default', async () => {
    const login = await crear(of({} as AccessPayload));

    login.form.setValue({ identifier: ' admin ', password: 'Admin123!' });
    login.submit();

    expect(llamadas).toEqual([{ identifier: 'admin', password: 'Admin123!' }]);
    expect(urls).toEqual(['/dashboard']);
  });

  it('should go to the requested internal url after logging in', async () => {
    const login = await crear(of({} as AccessPayload), '/pagos');

    login.form.setValue({ identifier: 'admin', password: 'x' });
    login.submit();

    expect(urls).toEqual(['/pagos']);
  });

  it('should ignore external, protocol-relative and login return urls', async () => {
    for (const mala of ['https://evil.com', '//evil.com', '/login?x=1']) {
      TestBed.resetTestingModule();
      const login = await crear(of({} as AccessPayload), mala);

      login.form.setValue({ identifier: 'admin', password: 'x' });
      login.submit();

      expect(urls).toEqual(['/dashboard']);
    }
  });

  it('should show the backend message and stop loading when the credentials are wrong', async () => {
    const login = await crear(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 401,
            error: { error: 'Invalid credentials' },
          }),
      ),
    );

    login.form.setValue({ identifier: 'admin', password: 'mala' });
    login.submit();

    expect(login.error()).toBe('Invalid credentials');
    expect(login.loading()).toBe(false);
    expect(urls).toEqual([]);
  });
});
