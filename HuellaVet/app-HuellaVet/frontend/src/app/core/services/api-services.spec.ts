import { Type } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppointmentApi } from '../../features/appointments/appointment-api';
import { ResourceApi } from '../../features/admin/resources/resource-api';
import { ResourceRoleApi } from '../../features/admin/resource-roles/resource-role-api';
import { RoleApi } from '../../features/admin/roles/role-api';
import { RoleUserApi } from '../../features/admin/role-users/role-user-api';
import { UserApi } from '../../features/admin/users/user-api';
import { ConsultationApi } from '../../features/consultations/consultation-api';
import { OwnerApi } from '../../features/owners/owner-api';
import { PayApi } from '../../features/pays/pay-api';
import { PetApi } from '../../features/pets/pet-api';
import { RecipeApi } from '../../features/recipes/recipe-api';
import { VaccineApplicationApi } from '../../features/vaccine-applications/vaccine-application-api';
import { VaccineBatchApi } from '../../features/vaccine-batches/vaccine-batch-api';
import { VaccineApi } from '../../features/vaccines/vaccine-api';
import { VeterinarianApi } from '../../features/veterinarians/veterinarian-api';

const BASE = environment.apiUrl;

interface ConLista {
  list(): Observable<unknown[]>;
}

/** [servicio, ruta HTTP, clave de la lista]: las claves salen de la captura del backend. */
const CASOS: Array<[string, Type<ConLista>, string, string]> = [
  ['OwnerApi', OwnerApi, 'propietarios', 'owners'],
  ['PetApi', PetApi, 'mascotas', 'pets'],
  ['VeterinarianApi', VeterinarianApi, 'veterinarios', 'veterinarians'],
  ['AppointmentApi', AppointmentApi, 'citas', 'appointments'],
  ['ConsultationApi', ConsultationApi, 'consultas', 'consultations'],
  ['VaccineApi', VaccineApi, 'vacunas', 'vaccines'],
  ['VaccineBatchApi', VaccineBatchApi, 'lotes-vacunas', 'vaccineBatches'],
  ['VaccineApplicationApi', VaccineApplicationApi, 'aplicaciones-vacunas', 'vaccineApplications'],
  ['RecipeApi', RecipeApi, 'recetas', 'recipes'],
  ['PayApi', PayApi, 'pagos', 'pays'],
  ['UserApi', UserApi, 'usuarios', 'users'],
  ['RoleApi', RoleApi, 'roles', 'roles'],
  ['ResourceApi', ResourceApi, 'recursos', 'resources'],
  ['RoleUserApi', RoleUserApi, 'asignaciones-rol', 'assignments'],
  ['ResourceRoleApi', ResourceRoleApi, 'concesiones-rol', 'grants'],
];

describe('Servicios HTTP', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should build URLs from environment.apiUrl without a trailing slash', () => {
    expect(environment.apiUrl).toBe('http://localhost:4000/api');
    expect(environment.apiUrl.endsWith('/')).toBe(false);
  });

  for (const [nombre, servicio, ruta, clave] of CASOS) {
    it(`should unwrap { ${clave} } into an array (${nombre})`, () => {
      const api = TestBed.inject(servicio);
      let resultado: unknown[] | undefined;
      api.list().subscribe((filas) => (resultado = filas));

      const peticion = http.expectOne(`${BASE}/${ruta}`);
      expect(peticion.request.method).toBe('GET');
      peticion.flush({ [clave]: [{ id: 1 }] });

      expect(resultado).toEqual([{ id: 1 }]);
    });
  }

  it('should unwrap { owner } in get and create, and send the right verbs', () => {
    const api = TestBed.inject(OwnerApi);
    const propietario = { id: 7, name: 'Ana' };

    let uno: unknown;
    api.get(7).subscribe((o) => (uno = o));
    http.expectOne(`${BASE}/propietarios/7`).flush({ owner: propietario });
    expect(uno).toEqual(propietario);

    let creado: unknown;
    api
      .create({ document_type: 'CC', document_number: '123', name: 'Ana' })
      .subscribe((o) => (creado = o));
    const alta = http.expectOne(`${BASE}/propietarios`);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual({ document_type: 'CC', document_number: '123', name: 'Ana' });
    alta.flush({ owner: propietario });
    expect(creado).toEqual(propietario);

    api.update(7, { name: 'Ana María' }).subscribe();
    const parcial = http.expectOne(`${BASE}/propietarios/7`);
    expect(parcial.request.method).toBe('PATCH');
    expect(parcial.request.body).toEqual({ name: 'Ana María' });
    parcial.flush({ owner: propietario });

    api
      .replace(7, { document_type: 'CC', document_number: '123', name: 'Ana' })
      .subscribe();
    const reemplazo = http.expectOne(`${BASE}/propietarios/7`);
    expect(reemplazo.request.method).toBe('PUT');
    reemplazo.flush({ owner: propietario });

    api.deactivate(7).subscribe();
    const baja = http.expectOne(`${BASE}/propietarios/7/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'ok', owner: propietario });

    api.remove(7).subscribe();
    const borrado = http.expectOne(`${BASE}/propietarios/7`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('should send the state through PATCH on appointments', () => {
    TestBed.inject(AppointmentApi).update(3, { state: 'completed' }).subscribe();
    const parcial = http.expectOne(`${BASE}/citas/3`);
    expect(parcial.request.method).toBe('PATCH');
    expect(parcial.request.body).toEqual({ state: 'completed' });
    parcial.flush({ appointment: { id: 3 } });
  });

  it('should send the amount of a payment as a number', () => {
    TestBed.inject(PayApi)
      .create({
        reference_type: 'appointment',
        reference_id: 1,
        method: 'efectivo',
        amount: 45000,
        date: '2026-10-28T10:00:00-05:00',
      })
      .subscribe();
    const alta = http.expectOne(`${BASE}/pagos`);
    expect((alta.request.body as { amount: number }).amount).toBe(45000);
    alta.flush({ pay: { id: 1, amount: '45000.00' } });
  });

  it('should read effective permissions from /usuarios/:id/permisos', () => {
    let permisos: unknown[] | undefined;
    TestBed.inject(UserApi)
      .permissions(2)
      .subscribe((p) => (permisos = p));
    http.expectOne(`${BASE}/usuarios/2/permisos`).flush({
      permissions: [{ resource_id: 1, method: 'GET', path: '/api/citas', role_id: 2 }],
    });
    expect(permisos?.length).toBe(1);
  });

  it('should filter grants by role and expose reactivate on the pivots', () => {
    const concesiones = TestBed.inject(ResourceRoleApi);
    concesiones.list({ role_id: 2 }).subscribe();
    const lista = http.expectOne((r) => r.url === `${BASE}/concesiones-rol`);
    expect(lista.request.params.get('role_id')).toBe('2');
    lista.flush({ grants: [] });

    concesiones.reactivate(5).subscribe();
    const reactivar = http.expectOne(`${BASE}/concesiones-rol/5/reactivate`);
    expect(reactivar.request.method).toBe('PATCH');
    reactivar.flush({ grant: { id: 5 } });

    TestBed.inject(RoleUserApi).reactivate(9).subscribe();
    http.expectOne(`${BASE}/asignaciones-rol/9/reactivate`).flush({ assignment: { id: 9 } });
  });
});
