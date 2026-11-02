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

const USUARIO = { id: 1, username: 'admin', email: 'a@huellavet.local', avatar: null, status: 'active' } as User;
const PERMISOS: EffectivePermission[] = ['propietarios', 'mascotas', 'citas', 'pagos'].map(
  (recurso, i): EffectivePermission => ({
    resource_id: i + 1,
    method: 'GET',
    path: `/api/${recurso}`,
    description: null,
    role_id: 1,
    role_name: 'ADMIN',
  }),
);

function cita(id: number, petId: number, startDate: string, state = 'scheduled') {
  return {
    id,
    pet_id: petId,
    veterinarian_id: 1,
    start_date: startDate,
    end_date: startDate,
    reason: `Motivo ${id}`,
    state,
  };
}

function pago(id: number, referenceId: number, amount: string, state: string) {
  return {
    id,
    reference_type: 'appointment',
    reference_id: referenceId,
    method: 'Efectivo',
    amount,
    date: '2026-10-05T09:35:00.000Z',
    state,
  };
}

describe('Dashboard', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    TestBed.inject(SessionStore).setAccess({ user: USUARIO, permissions: PERMISOS });
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  /** Responde las cuatro peticiones en paralelo que hace `load()`. */
  function responder(
    datos: {
      owners?: unknown[];
      pets?: unknown[];
      appointments?: unknown[];
      pays?: unknown[];
    } = {},
  ) {
    http.expectOne(OWNERS).flush({ owners: datos.owners ?? [{ id: 1 }, { id: 2 }] });
    http.expectOne(PETS).flush({
      pets: datos.pets ?? [
        { id: 1, name: 'Luna' },
        { id: 2, name: 'Rocky' },
        { id: 3, name: 'Milo' },
      ],
    });
    http.expectOne(APPOINTMENTS).flush({
      appointments: datos.appointments ?? [
        cita(1, 1, '2026-10-05T09:00:00.000Z'),
        cita(2, 2, '2026-10-06T10:00:00.000Z'),
      ],
    });
    http.expectOne(PAYS).flush({
      pays: datos.pays ?? [
        pago(1, 1, '85000.00', 'paid'),
        pago(2, 2, '50000.00', 'paid'),
        pago(3, 1, '10000.50', 'pending'),
      ],
    });
  }

  async function crear(datos: Parameters<typeof responder>[0] = {}) {
    const fixture = TestBed.createComponent(Dashboard);
    responder(datos);
    await fixture.whenStable();
    return {
      panel: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load the four lists in parallel and fill the counters', async () => {
    const { panel, compilado } = await crear();

    expect(panel.loading()).toBe(false);
    expect(panel.ownerCount()).toBe(2);
    expect(panel.pets().length).toBe(3);
    expect(panel.appointments().length).toBe(2);
    expect(compilado.textContent).toContain('Propietarios');
    expect(compilado.textContent).toContain('Mascotas');
    expect(compilado.textContent).toContain('Ingresos');
  });

  it('should sum only paid payments and normalize string amounts', async () => {
    const { panel } = await crear();

    expect(panel.revenue()).toBe(135000);
  });

  it('should list only pending payments with their appointment label', async () => {
    const { panel, compilado } = await crear();

    expect(panel.pendingPays().map((pay) => pay.id)).toEqual([3]);
    expect(compilado.textContent).toContain('Cita #1 · Motivo 1');
    expect(compilado.textContent).toContain('1 pendientes');
  });

  it('should show the latest appointments newest first and at most five', async () => {
    const seis = [1, 2, 3, 4, 5, 6].map((n) => cita(n, 1, `2026-10-0${n}T09:00:00.000Z`));
    const { panel } = await crear({ appointments: seis });

    expect(panel.latestAppointments().map((c) => c.id)).toEqual([6, 5, 4, 3, 2]);
  });

  it('should resolve the pet name and fall back to its id', async () => {
    const { panel } = await crear();

    expect(panel.petName()(1)).toBe('Luna');
    expect(panel.petName()(99)).toBe('Mascota #99');
  });

  it('should show empty states when there is no data', async () => {
    const { compilado } = await crear({ owners: [], pets: [], appointments: [], pays: [] });

    expect(compilado.textContent).toContain('Sin pagos pendientes');
    expect(compilado.textContent).toContain('Sin citas');
  });

  it('should show the error when a list fails', async () => {
    const fixture = TestBed.createComponent(Dashboard);
    http
      .expectOne(OWNERS)
      .flush({ error: 'Servidor caído' }, { status: 500, statusText: 'Internal Server Error' });
    // forkJoin cancela las otras peticiones al primer error.
    http.match(PETS);
    http.match(APPOINTMENTS);
    http.match(PAYS);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Servidor caído');
    expect(fixture.componentInstance.loading()).toBe(false);
  });
});
