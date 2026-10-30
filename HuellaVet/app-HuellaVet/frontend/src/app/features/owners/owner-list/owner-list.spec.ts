import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Owner } from '../../../core/models/owner.model';
import { NotificationService } from '../../../core/services/notification';
import { OwnerList } from './owner-list';

const BASE = `${environment.apiUrl}/propietarios`;

const PROPIETARIOS: Owner[] = [
  {
    id: 1,
    document_type: 'CC',
    document_number: '1001',
    name: 'Ana Pérez',
    phone: '3001112233',
    email: 'ana@correo.com',
    is_active: true,
  },
  {
    id: 2,
    document_type: 'CE',
    document_number: '2002',
    name: 'Luis Gómez',
    phone: null,
    email: null,
    is_active: true,
  },
];

/** Avisos que el componente pidió mostrar, en orden. */
const avisos: string[] = [];
let respuestaConfirmacion: 'accept' | 'reject' = 'accept';

const notificacionFalsa = {
  success: (resumen: string) => void avisos.push(`success:${resumen}`),
  info: (resumen: string) => void avisos.push(`info:${resumen}`),
  warn: (resumen: string) => void avisos.push(`warn:${resumen}`),
  error: (resumen: string) => void avisos.push(`error:${resumen}`),
};

/** Ejecuta `accept` o `reject` al instante, como si la persona hubiera pulsado. */
const confirmacionFalsa = {
  confirm(opciones: { accept?: () => void; reject?: () => void }) {
    if (respuestaConfirmacion === 'accept') {
      opciones.accept?.();
    } else {
      opciones.reject?.();
    }
    return this;
  },
};

describe('OwnerList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    avisos.length = 0;
    respuestaConfirmacion = 'accept';

    await TestBed.configureTestingModule({
      imports: [OwnerList],
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

  /** Crea la pantalla y responde la carga inicial con los datos recibidos. */
  async function crearLista(propietarios: Owner[] = PROPIETARIOS) {
    const fixture = TestBed.createComponent(OwnerList);
    http.expectOne(BASE).flush({ owners: propietarios });
    await fixture.whenStable();
    return { fixture, lista: fixture.componentInstance, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should render one row per owner', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('Ana Pérez');
  });

  it('should show the error, no rows and the empty state when the load fails', async () => {
    const fixture = TestBed.createComponent(OwnerList);
    http
      .expectOne(BASE)
      .flush({ error: 'Servidor caído' }, { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Servidor caído');
    expect(fixture.componentInstance.rows()).toEqual([]);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Servidor caído');
  });

  it('should filter locally without new requests', async () => {
    const { lista } = await crearLista();

    lista.filter.set('luis');

    expect(lista.visibleRows().map((o) => o.id)).toEqual([2]);
    http.expectNone(BASE);
  });

  it('should POST a new owner, close the dialog and reload', async () => {
    const { lista } = await crearLista();
    const cuerpo = {
      document_type: 'CC',
      document_number: '3003',
      name: 'Nuevo',
      phone: null,
      email: null,
      is_active: true,
    };

    lista.openCreate();
    lista.save(cuerpo);

    const alta = http.expectOne(BASE);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(cuerpo);
    alta.flush({ owner: { id: 3, ...cuerpo } });

    expect(lista.dialogVisible()).toBe(false);
    expect(avisos).toContain('success:Propietario creado');
    http.expectOne(BASE).flush({ owners: PROPIETARIOS });
  });

  it('should PATCH the edited owner and send no is_active', async () => {
    const { lista } = await crearLista();

    lista.openEdit(PROPIETARIOS[0]);
    lista.save({ document_type: 'CC', document_number: '1001', name: 'Ana María', phone: null, email: null });

    const cambio = http.expectOne(`${BASE}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect('is_active' in (cambio.request.body as object)).toBe(false);
    cambio.flush({ owner: PROPIETARIOS[0] });

    expect(avisos).toContain('success:Propietario actualizado');
    http.expectOne(BASE).flush({ owners: PROPIETARIOS });
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.deactivate(PROPIETARIOS[0]);

    const baja = http.expectOne(`${BASE}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'ok', owner: { ...PROPIETARIOS[0], is_active: false } });

    expect(avisos).toContain('warn:Propietario desactivado');
    http.expectOne(BASE).flush({ owners: PROPIETARIOS.slice(1) });
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.remove(PROPIETARIOS[1]);

    const borrado = http.expectOne(`${BASE}/2`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush(null, { status: 204, statusText: 'No Content' });

    expect(avisos).toContain('success:Propietario eliminado');
    http.expectOne(BASE).flush({ owners: PROPIETARIOS.slice(0, 1) });
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    respuestaConfirmacion = 'reject';

    lista.deactivate(PROPIETARIOS[0]);
    lista.remove(PROPIETARIOS[0]);

    http.expectNone(`${BASE}/1/deactivate`);
    http.expectNone(`${BASE}/1`);
  });

  it('should keep the dialog open and warn when saving fails', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({ document_type: 'CC', document_number: '1001', name: 'Repetido' });

    http
      .expectOne(BASE)
      .flush({ error: 'Internal server error' }, { status: 500, statusText: 'Server Error' });

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(avisos).toContain('error:No se pudo guardar');
  });
});
