import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { User } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import {
  confirmacionFalsa,
  fakes,
  notificacionFalsa,
  reiniciarFakes,
} from '../../../../core/testing/list-fakes';
import { UserList } from './user-list';

const USERS = `${environment.apiUrl}/usuarios`;

const USUARIOS: User[] = [
  { id: 1, username: 'admin', email: 'admin@huellavet.local', avatar: null, status: 'active' },
  { id: 2, username: 'seller', email: 'seller@huellavet.local', avatar: null, status: 'active' },
];

describe('UserList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    reiniciarFakes();

    await TestBed.configureTestingModule({
      imports: [UserList],
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

  async function crearLista(usuarios: User[] = USUARIOS) {
    const fixture = TestBed.createComponent(UserList);
    http.expectOne(USERS).flush({ users: usuarios });
    await fixture.whenStable();
    return {
      fixture,
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load the users and render one row per user', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('admin@huellavet.local');
  });

  it('should show the error and no rows when the load fails', async () => {
    const fixture = TestBed.createComponent(UserList);
    http.expectOne(USERS).flush({ error: 'Servidor caído' }, { status: 500, statusText: 'Error' });
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Servidor caído');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should filter locally by username and email without new requests', async () => {
    const { lista } = await crearLista();

    lista.filter.set('seller');
    expect(lista.visibleRows().map((u) => u.id)).toEqual([2]);

    lista.filter.set('ADMIN@');
    expect(lista.visibleRows().map((u) => u.id)).toEqual([1]);

    http.expectNone(USERS);
  });

  it('should recognize the session user so the page can protect it', async () => {
    const { lista } = await crearLista();
    TestBed.inject(SessionStore).setAccess({ user: USUARIOS[0], permissions: [] });

    expect(lista.isSelf(USUARIOS[0])).toBe(true);
    expect(lista.isSelf(USUARIOS[1])).toBe(false);
  });

  it('should POST a new user with password and status, close the dialog and reload', async () => {
    const { lista } = await crearLista();
    const cuerpo = {
      username: 'maria',
      email: 'maria@huellavet.local',
      avatar: null,
      password: 'Abcdefg1!',
      status: 'active' as const,
    };

    lista.openCreate();
    lista.save(cuerpo);

    const alta = http.expectOne(USERS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(cuerpo);
    alta.flush({ user: { id: 9, ...cuerpo, password: undefined } });

    expect(lista.dialogVisible()).toBe(false);
    expect(fakes.avisos).toContain('success:Usuario creado');
    http.expectOne(USERS).flush({ users: USUARIOS });
  });

  it('should PATCH the edited user and never send password or status', async () => {
    const { lista } = await crearLista();

    lista.openEdit(USUARIOS[1]);
    lista.save({ username: 'seller', email: 'nuevo@huellavet.local', avatar: null });

    const cambio = http.expectOne(`${USERS}/2`);
    expect(cambio.request.method).toBe('PATCH');
    expect('password' in (cambio.request.body as object)).toBe(false);
    expect('status' in (cambio.request.body as object)).toBe(false);
    cambio.flush({ user: USUARIOS[1] });

    expect(fakes.avisos).toContain('success:Usuario actualizado');
    http.expectOne(USERS).flush({ users: USUARIOS });
  });

  it('should keep the dialog open and warn when saving fails', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({ username: 'admin', email: 'x@huellavet.local', avatar: null, password: 'Abcdefg1!', status: 'active' });

    http.expectOne(USERS).flush({ error: 'Username already in use' }, { status: 409, statusText: 'Conflict' });

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(fakes.avisos).toContain('error:No se pudo guardar');
  });

  it('should call deactivate and DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.deactivate(USUARIOS[1]);
    const baja = http.expectOne(`${USERS}/2/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'ok' });
    http.expectOne(USERS).flush({ users: USUARIOS.slice(0, 1) });

    lista.remove(USUARIOS[0]);
    const borrado = http.expectOne(`${USERS}/1`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'ok', id: 1 });
    http.expectOne(USERS).flush({ users: [] });
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    fakes.respuesta = 'reject';

    lista.deactivate(USUARIOS[1]);
    lista.remove(USUARIOS[1]);

    http.expectNone(`${USERS}/2/deactivate`);
    http.expectNone(`${USERS}/2`);
  });

  it('should load the effective permissions and derive the roles', async () => {
    const { lista } = await crearLista();

    lista.showPermissions(USUARIOS[1]);
    expect(lista.accessVisible()).toBe(true);
    expect(lista.accessLoading()).toBe(true);

    http.expectOne(`${USERS}/2/permisos`).flush({
      permissions: [
        { resource_id: 1, method: 'GET', path: '/api/propietarios', description: null, role_id: 2, role_name: 'RECEPCIONISTA' },
        { resource_id: 24, method: 'POST', path: '/api/citas', description: null, role_id: 2, role_name: 'RECEPCIONISTA' },
      ],
    });

    expect(lista.access().length).toBe(2);
    expect(lista.accessRoles()).toEqual(['RECEPCIONISTA']);
    expect(lista.accessLoading()).toBe(false);
  });

  it('should close the permissions dialog and warn when the query fails', async () => {
    const { lista } = await crearLista();

    lista.showPermissions(USUARIOS[1]);
    http.expectOne(`${USERS}/2/permisos`).flush({ error: 'Forbidden' }, { status: 403, statusText: 'Forbidden' });

    expect(lista.accessVisible()).toBe(false);
    expect(fakes.avisos).toContain('error:No se pudieron consultar los permisos');
  });
});
