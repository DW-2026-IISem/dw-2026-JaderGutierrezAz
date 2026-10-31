import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Vaccine } from '../../../core/models/vaccine.model';
import { NotificationService } from '../../../core/services/notification';
import { VaccineList } from './vaccine-list';

const BASE = `${environment.apiUrl}/vacunas`;

const VACUNAS: Vaccine[] = [
  { id: 1, name: 'Antirrábica', description: 'Refuerzo anual', is_active: true },
  { id: 2, name: 'Polivalente', description: null, is_active: true },
];

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

describe('VaccineList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    avisos.length = 0;
    respuestaConfirmacion = 'accept';

    await TestBed.configureTestingModule({
      imports: [VaccineList],
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

  async function crearLista(vacunas: Vaccine[] = VACUNAS) {
    const fixture = TestBed.createComponent(VaccineList);
    http.expectOne(BASE).flush({ vaccines: vacunas });
    await fixture.whenStable();
    return {
      fixture,
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should render one row per vaccine', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('Antirrábica');
  });

  it('should show the error, no rows and the empty state when the load fails', async () => {
    const fixture = TestBed.createComponent(VaccineList);
    http
      .expectOne(BASE)
      .flush({ error: 'Servidor caído' }, { status: 500, statusText: 'Internal Server Error' });
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Servidor caído');
    expect(fixture.componentInstance.rows()).toEqual([]);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Servidor caído');
  });

  it('should filter locally by name and description without new requests', async () => {
    const { lista } = await crearLista();

    lista.filter.set('refuerzo');
    expect(lista.visibleRows().map((v) => v.id)).toEqual([1]);

    lista.filter.set('polivalente');
    expect(lista.visibleRows().map((v) => v.id)).toEqual([2]);

    http.expectNone(BASE);
  });

  it('should POST a new vaccine, close the dialog and reload', async () => {
    const { lista } = await crearLista();
    const cuerpo = { name: 'Nueva', description: null, is_active: true };

    lista.openCreate();
    lista.save(cuerpo);

    const alta = http.expectOne(BASE);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(cuerpo);
    alta.flush({ vaccine: { id: 3, ...cuerpo } });

    expect(lista.dialogVisible()).toBe(false);
    expect(avisos).toContain('success:Vacuna creada');
    http.expectOne(BASE).flush({ vaccines: VACUNAS });
  });

  it('should PATCH the edited vaccine and send no is_active', async () => {
    const { lista } = await crearLista();

    lista.openEdit(VACUNAS[0]);
    lista.save({ name: 'Antirrábica II', description: 'Refuerzo anual' });

    const cambio = http.expectOne(`${BASE}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect('is_active' in (cambio.request.body as object)).toBe(false);
    cambio.flush({ vaccine: VACUNAS[0] });

    expect(avisos).toContain('success:Vacuna actualizada');
    http.expectOne(BASE).flush({ vaccines: VACUNAS });
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.deactivate(VACUNAS[0]);

    const baja = http.expectOne(`${BASE}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'ok', vaccine: { ...VACUNAS[0], is_active: false } });

    expect(avisos).toContain('warn:Vacuna desactivada');
    http.expectOne(BASE).flush({ vaccines: VACUNAS.slice(1) });
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.remove(VACUNAS[1]);

    const borrado = http.expectOne(`${BASE}/2`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush(null, { status: 204, statusText: 'No Content' });

    expect(avisos).toContain('success:Vacuna eliminada');
    http.expectOne(BASE).flush({ vaccines: VACUNAS.slice(0, 1) });
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    respuestaConfirmacion = 'reject';

    lista.deactivate(VACUNAS[0]);
    lista.remove(VACUNAS[0]);

    http.expectNone(`${BASE}/1/deactivate`);
    http.expectNone(`${BASE}/1`);
  });

  it('should keep the dialog open and warn when saving fails', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({ name: 'Falla' });

    http
      .expectOne(BASE)
      .flush({ error: 'Internal server error' }, { status: 500, statusText: 'Server Error' });

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(avisos).toContain('error:No se pudo guardar');
  });
});
