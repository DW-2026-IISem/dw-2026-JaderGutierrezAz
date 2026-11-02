import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { EffectivePermission } from '../../core/models/auth.model';
import { User } from '../../core/models/user.model';
import { SessionStore } from '../../core/services/session-store';
import { Dashboard } from './dashboard';

const OWNERS = `${environment.apiUrl}/propietarios`;
const PETS = `${environment.apiUrl}/mascotas`;
const APPOINTMENTS = `${environment.apiUrl}/citas`;
const PAYS = `${environment.apiUrl}/pagos`;

const RECEPCION = { id: 2, username: 'seller', email: 's@huellavet.local', avatar: null, status: 'active' } as User;

/** Los permisos de lectura de `seller`: ve propietarios, mascotas y citas, pero no pagos. */
const PERMISOS: EffectivePermission[] = ['propietarios', 'mascotas', 'citas'].map(
  (recurso, i): EffectivePermission => ({
    resource_id: i + 1,
    method: 'GET',
    path: `/api/${recurso}`,
    description: null,
    role_id: 2,
    role_name: 'RECEPCIONISTA',
  }),
);

describe('Dashboard con un rol sin lectura de pagos', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    TestBed.inject(SessionStore).setAccess({ user: RECEPCION, permissions: PERMISOS });
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('should not request payments and should hide the payment cards', async () => {
    const fixture = TestBed.createComponent(Dashboard);

    http.expectOne(OWNERS).flush({ owners: [{ id: 1 }] });
    http.expectOne(PETS).flush({ pets: [{ id: 1, name: 'Luna' }] });
    http.expectOne(APPOINTMENTS).flush({ appointments: [] });
    http.expectNone(PAYS);
    await fixture.whenStable();

    const compilado = fixture.nativeElement as HTMLElement;
    expect(fixture.componentInstance.pays()).toEqual([]);
    expect(fixture.componentInstance.error()).toBeNull();
    expect(compilado.textContent).toContain('Propietarios');
    expect(compilado.textContent).toContain('Últimas citas');
    expect(compilado.textContent).not.toContain('Ingresos');
    expect(compilado.textContent).not.toContain('Pagos pendientes');
  });
});
