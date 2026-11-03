import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { EffectivePermission } from '../../../../core/models/auth.model';
import { Resource } from '../../../../core/models/resource.model';
import { ResourceRole } from '../../../../core/models/resource-role.model';
import { Role } from '../../../../core/models/role.model';
import { User } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import {
  confirmacionFalsa,
  fakes,
  notificacionFalsa,
  reiniciarFakes,
} from '../../../../core/testing/list-fakes';
import { ResourceRoleList } from './resource-role-list';

const GRANTS = `${environment.apiUrl}/concesiones-rol`;
const ROLES = `${environment.apiUrl}/roles`;
const RESOURCES = `${environment.apiUrl}/recursos`;

const ROLES_DATOS: Role[] = [
  { id: 1, name: 'ADMIN', description: null, status: 'active' },
  { id: 2, name: 'RECEPCIONISTA', description: null, status: 'active' },
  { id: 3, name: 'VIEJO', description: null, status: 'inactive' },
];

const RECURSOS: Resource[] = [
  { id: 1, method: 'GET', path: '/api/propietarios', description: 'Listar propietario', status: 'active' },
  { id: 64, method: 'GET', path: '/api/pagos', description: 'Listar pago', status: 'active' },
  { id: 99, method: 'GET', path: '/api/viejo', description: null, status: 'inactive' },
];

const CONCESIONES: ResourceRole[] = [
  {
    id: 10, role_id: 2, resource_id: 1, status: 'active',
    role: { id: 2, name: 'RECEPCIONISTA' },
    resource: { id: 1, method: 'GET', path: '/api/propietarios', description: 'Listar propietario' },
  },
  {
    id: 11, role_id: 1, resource_id: 64, status: 'inactive',
    role: { id: 1, name: 'ADMIN' },
    resource: { id: 64, method: 'GET', path: '/api/pagos', description: 'Listar pago' },
  },
];

describe('ResourceRoleList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    reiniciarFakes();

    await TestBed.configureTestingModule({
      imports: [ResourceRoleList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notificacionFalsa },
        { provide: ConfirmationService, useValue: confirmacionFalsa },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  function responderCarga(concesiones: ResourceRole[] = CONCESIONES) {
    http.expectOne(GRANTS).flush({ grants: concesiones });
    http.expectOne(ROLES).flush({ roles: ROLES_DATOS });
    http.expectOne(RESOURCES).flush({ resources: RECURSOS });
  }

  async function crearLista() {
    const fixture = TestBed.createComponent(ResourceRoleList);
    responderCarga();
    await fixture.whenStable();
    return {
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load grants, roles and resources in parallel and render one row per grant', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('/api/propietarios');
    expect(compilado.textContent).toContain('RECEPCIONISTA');
  });

  it('should offer only active roles and active resources in the dialog', async () => {
    const { lista } = await crearLista();

    expect(lista.roleOptions().map((o) => o.id)).toEqual([1, 2]);
    expect(lista.resourceOptions().map((r) => r.id)).toEqual([1, 64]);
  });

  it('should filter by role and by text without new requests', async () => {
    const { lista } = await crearLista();

    lista.roleFilter.set(2);
    expect(lista.visibleRows().map((r) => r.id)).toEqual([10]);

    lista.roleFilter.set(null);
    lista.filter.set('pagos');
    expect(lista.visibleRows().map((r) => r.id)).toEqual([11]);

    http.expectNone(GRANTS);
  });

  it('should keep the save button disabled until a role and a resource are chosen', async () => {
    const { lista } = await crearLista();

    lista.openGrant();
    expect(lista.canSave()).toBe(false);

    lista.selectedRole.set(2);
    lista.selectedResource.set(64);
    expect(lista.canSave()).toBe(true);
  });

  it('should POST the grant with numeric ids, close the dialog and reload', async () => {
    const { lista } = await crearLista();

    lista.openGrant();
    lista.selectedRole.set(2);
    lista.selectedResource.set(64);
    lista.grant();

    const alta = http.expectOne(GRANTS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual({ role_id: 2, resource_id: 64 });
    alta.flush({ message: 'Resource granted to role', grant: { id: 12, role_id: 2, resource_id: 64, status: 'active' } });

    expect(lista.dialogVisible()).toBe(false);
    expect(fakes.avisos).toContain('success:Permiso concedido');
    responderCarga();
  });

  it('should show the backend message when the role already has the resource', async () => {
    const { lista } = await crearLista();

    lista.openGrant();
    lista.selectedRole.set(2);
    lista.selectedResource.set(1);
    lista.grant();

    http
      .expectOne(GRANTS)
      .flush({ error: 'Role already has this resource granted' }, { status: 409, statusText: 'Conflict' });

    expect(lista.dialogVisible()).toBe(true);
    expect(fakes.avisos).toContain('error:No se pudo conceder');
  });

  it('should revoke an active grant after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.revoke(CONCESIONES[0]);

    const baja = http.expectOne(`${GRANTS}/10/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'ok' });

    expect(fakes.avisos).toContain('warn:Permiso revocado');
    responderCarga();
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    fakes.respuesta = 'reject';

    lista.revoke(CONCESIONES[0]);

    http.expectNone(`${GRANTS}/10/deactivate`);
  });

  it('should reactivate an inactive grant', async () => {
    const { lista } = await crearLista();

    lista.restore(CONCESIONES[1]);

    const alta = http.expectOne(`${GRANTS}/11/reactivate`);
    expect(alta.request.method).toBe('PATCH');
    alta.flush({ message: 'ok' });

    expect(fakes.avisos).toContain('success:Permiso reactivado');
    responderCarga();
  });

  it('should warn when the revoked grant belongs to a role the session uses', async () => {
    const { lista } = await crearLista();
    const usuario = { id: 1, username: 'admin', email: 'a@h.local', avatar: null, status: 'active' } as User;
    const permisos: EffectivePermission[] = [
      { resource_id: 64, method: 'GET', path: '/api/pagos', description: null, role_id: 1, role_name: 'ADMIN' },
    ];
    TestBed.inject(SessionStore).setAccess({ user: usuario, permissions: permisos });

    expect(lista.affectsSession(CONCESIONES[1])).toBe(true);
    expect(lista.affectsSession(CONCESIONES[0])).toBe(false);
  });
});
