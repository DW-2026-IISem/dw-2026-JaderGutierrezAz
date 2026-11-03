import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { EffectivePermission } from '../../../../core/models/auth.model';
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
import { RoleList } from './role-list';

const ROLES = `${environment.apiUrl}/roles`;

const LISTA: Role[] = [
  { id: 1, name: 'ADMIN', description: 'Todo', status: 'active' },
  { id: 2, name: 'RECEPCIONISTA', description: 'Recepción', status: 'active' },
];

describe('RoleList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    reiniciarFakes();

    await TestBed.configureTestingModule({
      imports: [RoleList],
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

  async function crearLista(roles: Role[] = LISTA) {
    const fixture = TestBed.createComponent(RoleList);
    http.expectOne(ROLES).flush({ roles });
    await fixture.whenStable();
    return {
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load the roles and render one row per role', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('RECEPCIONISTA');
  });

  it('should filter locally by name and description', async () => {
    const { lista } = await crearLista();

    lista.filter.set('recep');
    expect(lista.visibleRows().map((r) => r.id)).toEqual([2]);

    http.expectNone(ROLES);
  });

  it('should flag the roles that the current session uses', async () => {
    const { lista } = await crearLista();
    const usuario = { id: 1, username: 'admin', email: 'a@h.local', avatar: null, status: 'active' } as User;
    const permisos: EffectivePermission[] = [
      { resource_id: 1, method: 'GET', path: '/api/roles', description: null, role_id: 1, role_name: 'ADMIN' },
    ];
    TestBed.inject(SessionStore).setAccess({ user: usuario, permissions: permisos });

    expect(lista.isSessionRole(LISTA[0])).toBe(true);
    expect(lista.isSessionRole(LISTA[1])).toBe(false);
  });

  it('should POST a new role with status, close the dialog and reload', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({ name: 'VETERINARIO', description: null, status: 'active' });

    const alta = http.expectOne(ROLES);
    expect(alta.request.method).toBe('POST');
    alta.flush({ role: { id: 4, name: 'VETERINARIO', description: null, status: 'active' } });

    expect(lista.dialogVisible()).toBe(false);
    expect(fakes.avisos).toContain('success:Rol creado');
    http.expectOne(ROLES).flush({ roles: LISTA });
  });

  it('should PATCH the edited role and send no status', async () => {
    const { lista } = await crearLista();

    lista.openEdit(LISTA[1]);
    lista.save({ name: 'RECEPCION', description: 'Recepción' });

    const cambio = http.expectOne(`${ROLES}/2`);
    expect(cambio.request.method).toBe('PATCH');
    expect('status' in (cambio.request.body as object)).toBe(false);
    cambio.flush({ role: { ...LISTA[1], name: 'RECEPCION' } });

    expect(fakes.avisos).toContain('success:Rol actualizado');
    http.expectOne(ROLES).flush({ roles: LISTA });
  });

  it('should call deactivate and DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.deactivate(LISTA[1]);
    http.expectOne(`${ROLES}/2/deactivate`).flush({ message: 'ok' });
    http.expectOne(ROLES).flush({ roles: LISTA.slice(0, 1) });

    lista.remove(LISTA[0]);
    const borrado = http.expectOne(`${ROLES}/1`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'ok', id: 1 });
    http.expectOne(ROLES).flush({ roles: [] });
  });

  it('should explain the failure when the database rejects the DELETE', async () => {
    const { lista } = await crearLista();

    lista.remove(LISTA[1]);
    http
      .expectOne(`${ROLES}/2`)
      .flush({ error: 'Internal server error', detail: 'violates foreign key constraint' }, { status: 500, statusText: 'Error' });

    expect(fakes.avisos).toContain('error:No se pudo eliminar');
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    fakes.respuesta = 'reject';

    lista.deactivate(LISTA[1]);
    lista.remove(LISTA[1]);

    http.expectNone(`${ROLES}/2/deactivate`);
    http.expectNone(`${ROLES}/2`);
  });
});
