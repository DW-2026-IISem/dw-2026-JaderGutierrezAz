import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../../environments/environment';
import { Resource } from '../../../../core/models/resource.model';
import { NotificationService } from '../../../../core/services/notification';
import {
  confirmacionFalsa,
  fakes,
  notificacionFalsa,
  reiniciarFakes,
} from '../../../../core/testing/list-fakes';
import { ResourceList } from './resource-list';

const RESOURCES = `${environment.apiUrl}/recursos`;

const LISTA: Resource[] = [
  { id: 1, method: 'GET', path: '/api/propietarios', description: 'Listar propietario', status: 'active' },
  { id: 3, method: 'POST', path: '/api/propietarios', description: 'Crear propietario', status: 'active' },
  { id: 64, method: 'GET', path: '/api/pagos', description: 'Listar pago', status: 'active' },
];

describe('ResourceList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    reiniciarFakes();

    await TestBed.configureTestingModule({
      imports: [ResourceList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notificacionFalsa },
        { provide: ConfirmationService, useValue: confirmacionFalsa },
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  async function crearLista(recursos: Resource[] = LISTA) {
    const fixture = TestBed.createComponent(ResourceList);
    http.expectOne(RESOURCES).flush({ resources: recursos });
    await fixture.whenStable();
    return {
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load the resources and render one row per resource', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(3);
    expect(compilado.textContent).toContain('/api/pagos');
  });

  it('should count the resources of each method', async () => {
    const { lista } = await crearLista();
    const conteo = Object.fromEntries(lista.countsByMethod().map((c) => [c.method, c.count]));

    expect(conteo).toEqual({ GET: 2, POST: 1, PUT: 0, PATCH: 0, DELETE: 0 });
  });

  it('should filter by text and by method without new requests', async () => {
    const { lista } = await crearLista();

    lista.filter.set('propietarios');
    expect(lista.visibleRows().map((r) => r.id)).toEqual([1, 3]);

    lista.methodFilter.set('GET');
    expect(lista.visibleRows().map((r) => r.id)).toEqual([1]);

    lista.filter.set('');
    lista.methodFilter.set('');
    expect(lista.visibleRows().length).toBe(3);

    http.expectNone(RESOURCES);
  });

  it('should POST a new resource with status, close the dialog and reload', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({ method: 'DELETE', path: '/api/pagos/:id', description: null, status: 'active' });

    const alta = http.expectOne(RESOURCES);
    expect(alta.request.method).toBe('POST');
    alta.flush({ resource: { id: 104, method: 'DELETE', path: '/api/pagos/:id', description: null, status: 'active' } });

    expect(lista.dialogVisible()).toBe(false);
    expect(fakes.avisos).toContain('success:Recurso creado');
    http.expectOne(RESOURCES).flush({ resources: LISTA });
  });

  it('should PATCH the edited resource and send no status', async () => {
    const { lista } = await crearLista();

    lista.openEdit(LISTA[2]);
    lista.save({ method: 'GET', path: '/api/pagos', description: 'Listar pagos' });

    const cambio = http.expectOne(`${RESOURCES}/64`);
    expect(cambio.request.method).toBe('PATCH');
    expect('status' in (cambio.request.body as object)).toBe(false);
    cambio.flush({ resource: LISTA[2] });

    http.expectOne(RESOURCES).flush({ resources: LISTA });
  });

  it('should show the duplicate message when the pair already exists', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({ method: 'GET', path: '/api/pagos', description: null, status: 'active' });

    http
      .expectOne(RESOURCES)
      .flush({ error: 'Resource GET /api/pagos already exists' }, { status: 409, statusText: 'Conflict' });

    expect(lista.dialogVisible()).toBe(true);
    expect(fakes.avisos).toContain('error:No se pudo guardar');
  });

  it('should call deactivate and DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.deactivate(LISTA[2]);
    http.expectOne(`${RESOURCES}/64/deactivate`).flush({ message: 'ok' });
    http.expectOne(RESOURCES).flush({ resources: LISTA.slice(0, 2) });

    lista.remove(LISTA[0]);
    const borrado = http.expectOne(`${RESOURCES}/1`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'ok', id: 1 });
    http.expectOne(RESOURCES).flush({ resources: [] });
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    fakes.respuesta = 'reject';

    lista.deactivate(LISTA[2]);
    lista.remove(LISTA[2]);

    http.expectNone(`${RESOURCES}/64/deactivate`);
    http.expectNone(`${RESOURCES}/64`);
  });
});
