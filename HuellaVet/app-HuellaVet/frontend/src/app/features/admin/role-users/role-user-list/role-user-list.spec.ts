import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { Role } from '../../../../core/models/role.model';
import { RoleUser } from '../../../../core/models/role-user.model';
import { User } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import {
  confirmacionFalsa,
  fakes,
  notificacionFalsa,
  reiniciarFakes,
} from '../../../../core/testing/list-fakes';
import { RoleUserList } from './role-user-list';

const ASSIGNMENTS = `${environment.apiUrl}/asignaciones-rol`;
const USERS = `${environment.apiUrl}/usuarios`;
const ROLES = `${environment.apiUrl}/roles`;

const USUARIOS: User[] = [
  { id: 1, username: 'admin', email: 'admin@huellavet.local', avatar: null, status: 'active' },
  { id: 2, username: 'seller', email: 'seller@huellavet.local', avatar: null, status: 'active' },
  { id: 3, username: 'baja', email: 'baja@huellavet.local', avatar: null, status: 'inactive' },
];

const ROLES_DATOS: Role[] = [
  { id: 1, name: 'ADMIN', description: null, status: 'active' },
  { id: 2, name: 'RECEPCIONISTA', description: null, status: 'active' },
  { id: 3, name: 'VIEJO', description: null, status: 'inactive' },
];

const ASIGNACIONES: RoleUser[] = [
  {
    id: 1, user_id: 1, role_id: 1, status: 'active',
    user: { id: 1, username: 'admin', email: 'admin@huellavet.local' }, role: { id: 1, name: 'ADMIN' },
  },
  {
    id: 2, user_id: 2, role_id: 2, status: 'inactive',
    user: { id: 2, username: 'seller', email: 'seller@huellavet.local' }, role: { id: 2, name: 'RECEPCIONISTA' },
  },
];

describe('RoleUserList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    reiniciarFakes();

    await TestBed.configureTestingModule({
      imports: [RoleUserList],
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

  function responderCarga(asignaciones: RoleUser[] = ASIGNACIONES) {
    http.expectOne(ASSIGNMENTS).flush({ assignments: asignaciones });
    http.expectOne(USERS).flush({ users: USUARIOS });
    http.expectOne(ROLES).flush({ roles: ROLES_DATOS });
  }

  async function crearLista() {
    const fixture = TestBed.createComponent(RoleUserList);
    responderCarga();
    await fixture.whenStable();
    return {
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load assignments, users and roles in parallel and render one row each', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('admin');
    expect(compilado.textContent).toContain('RECEPCIONISTA');
  });

  it('should offer only active users and roles in the dialog', async () => {
    const { lista } = await crearLista();

    expect(lista.userOptions().map((o) => o.id)).toEqual([1, 2]);
    expect(lista.roleOptions().map((o) => o.id)).toEqual([1, 2]);
  });

  it('should filter by user and by role', async () => {
    const { lista } = await crearLista();

    lista.userFilter.set(2);
    expect(lista.visibleRows().map((r) => r.id)).toEqual([2]);

    lista.userFilter.set(null);
    lista.roleFilter.set(1);
    expect(lista.visibleRows().map((r) => r.id)).toEqual([1]);
  });

  it('should keep the save button disabled until a user and a role are chosen', async () => {
    const { lista } = await crearLista();

    lista.openAssign();
    expect(lista.canSave()).toBe(false);

    lista.selectedUser.set(2);
    expect(lista.canSave()).toBe(false);

    lista.selectedRole.set(1);
    expect(lista.canSave()).toBe(true);
  });

  it('should POST the assignment with numeric ids, close the dialog and reload', async () => {
    const { lista } = await crearLista();

    lista.openAssign();
    lista.selectedUser.set(2);
    lista.selectedRole.set(1);
    lista.assign();

    const alta = http.expectOne(ASSIGNMENTS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual({ user_id: 2, role_id: 1 });
    alta.flush({ assignment: { id: 5, user_id: 2, role_id: 1, status: 'active' } });

    expect(lista.dialogVisible()).toBe(false);
    expect(fakes.avisos).toContain('success:Rol asignado');
    responderCarga();
  });

  it('should show the backend message and keep the dialog open when the role is already assigned', async () => {
    const { lista } = await crearLista();

    lista.openAssign();
    lista.selectedUser.set(1);
    lista.selectedRole.set(1);
    lista.assign();

    http
      .expectOne(ASSIGNMENTS)
      .flush({ error: 'Role is already assigned to this user' }, { status: 409, statusText: 'Conflict' });

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(fakes.avisos).toContain('error:No se pudo asignar');
  });

  it('should retire an active assignment after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.retire(ASIGNACIONES[0]);

    const baja = http.expectOne(`${ASSIGNMENTS}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'ok' });

    expect(fakes.avisos).toContain('warn:Rol retirado');
    responderCarga();
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    fakes.respuesta = 'reject';

    lista.retire(ASIGNACIONES[0]);

    http.expectNone(`${ASSIGNMENTS}/1/deactivate`);
  });

  it('should reactivate an inactive assignment', async () => {
    const { lista } = await crearLista();

    lista.restore(ASIGNACIONES[1]);

    const alta = http.expectOne(`${ASSIGNMENTS}/2/reactivate`);
    expect(alta.request.method).toBe('PATCH');
    alta.flush({ message: 'ok' });

    expect(fakes.avisos).toContain('success:Rol reactivado');
    responderCarga();
  });

  it('should recognize the assignment of the session user', async () => {
    const { lista } = await crearLista();
    TestBed.inject(SessionStore).setAccess({ user: USUARIOS[0], permissions: [] });

    expect(lista.isOwn(ASIGNACIONES[0])).toBe(true);
    expect(lista.isOwn(ASIGNACIONES[1])).toBe(false);
  });
});
