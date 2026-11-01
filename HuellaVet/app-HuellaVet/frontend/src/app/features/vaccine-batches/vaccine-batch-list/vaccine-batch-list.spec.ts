import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Vaccine } from '../../../core/models/vaccine.model';
import { VaccineBatch } from '../../../core/models/vaccine-batch.model';
import { NotificationService } from '../../../core/services/notification';
import { VaccineBatchList } from './vaccine-batch-list';

const BATCHES = `${environment.apiUrl}/lotes-vacunas`;
const VACCINES = `${environment.apiUrl}/vacunas`;

const LOTES: VaccineBatch[] = [
  { id: 1, vaccine_id: 1, name: 'Lote A-001', description: 'Vence 2027', is_active: true },
  { id: 2, vaccine_id: 2, name: 'Lote B-002', description: null, is_active: true },
];

const VACUNAS: Vaccine[] = [
  { id: 1, name: 'Antirrábica', description: null, is_active: true },
  { id: 2, name: 'Polivalente', description: null, is_active: true },
  { id: 3, name: 'Vacuna Inactiva', description: null, is_active: false },
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

describe('VaccineBatchList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    avisos.length = 0;
    respuestaConfirmacion = 'accept';

    await TestBed.configureTestingModule({
      imports: [VaccineBatchList],
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

  /** Responde las dos peticiones en paralelo que hace `load()`. */
  function responderCarga(lotes: VaccineBatch[] = LOTES, vacunas: Vaccine[] = VACUNAS) {
    http.expectOne(BATCHES).flush({ vaccineBatches: lotes });
    http.expectOne(VACCINES).flush({ vaccines: vacunas });
  }

  async function crearLista(lotes: VaccineBatch[] = LOTES, vacunas: Vaccine[] = VACUNAS) {
    const fixture = TestBed.createComponent(VaccineBatchList);
    responderCarga(lotes, vacunas);
    await fixture.whenStable();
    return {
      fixture,
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load batches and vaccines in parallel and render one row per batch with the vaccine name', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('Lote A-001');
    expect(compilado.textContent).toContain('Antirrábica');
    expect(compilado.textContent).toContain('Polivalente');
  });

  it('should fall back to the id when the vaccine is unknown', async () => {
    const { lista } = await crearLista([
      { id: 9, vaccine_id: 99, name: 'Huérfano', description: null, is_active: true },
    ]);

    expect(lista.vaccineName()(99)).toBe('Vacuna #99');
  });

  it('should show the error and no rows when the load fails', async () => {
    const fixture = TestBed.createComponent(VaccineBatchList);
    http
      .expectOne(BATCHES)
      .flush({ error: 'Servidor caído' }, { status: 500, statusText: 'Internal Server Error' });
    // forkJoin cancela la otra petición al primer error.
    http.match(VACCINES);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Servidor caído');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should filter locally by batch, description and vaccine name without new requests', async () => {
    const { lista } = await crearLista();

    lista.filter.set('vence');
    expect(lista.visibleRows().map((b) => b.id)).toEqual([1]);

    lista.filter.set('polivalente');
    expect(lista.visibleRows().map((b) => b.id)).toEqual([2]);

    http.expectNone(BATCHES);
    http.expectNone(VACCINES);
  });

  it('should offer only active vaccines in the form', async () => {
    const { lista } = await crearLista();

    expect(lista.formVaccines().map((v) => v.id)).toEqual([1, 2]);
  });

  it('should keep the inactive vaccine of the batch that is being edited', async () => {
    const { lista } = await crearLista();

    lista.openEdit({ id: 7, vaccine_id: 3, name: 'Lote viejo', description: null, is_active: true });

    expect(lista.formVaccines().map((v) => v.id)).toEqual([1, 2, 3]);
  });

  it('should POST a new batch with the numeric vaccine_id, close the dialog and reload', async () => {
    const { lista } = await crearLista();
    const cuerpo = { vaccine_id: 1, name: 'Nuevo lote', description: null, is_active: true };

    lista.openCreate();
    lista.save(cuerpo);

    const alta = http.expectOne(BATCHES);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(cuerpo);
    alta.flush({ vaccineBatch: { id: 3, ...cuerpo } });

    expect(lista.dialogVisible()).toBe(false);
    expect(avisos).toContain('success:Lote creado');
    responderCarga();
  });

  it('should PATCH the edited batch and send no is_active', async () => {
    const { lista } = await crearLista();

    lista.openEdit(LOTES[0]);
    lista.save({ vaccine_id: 1, name: 'Lote A-001 bis', description: 'Vence 2027' });

    const cambio = http.expectOne(`${BATCHES}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect('is_active' in (cambio.request.body as object)).toBe(false);
    cambio.flush({ vaccineBatch: LOTES[0] });

    expect(avisos).toContain('success:Lote actualizado');
    responderCarga();
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.deactivate(LOTES[0]);

    const baja = http.expectOne(`${BATCHES}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'ok', vaccineBatch: { ...LOTES[0], is_active: false } });

    expect(avisos).toContain('warn:Lote desactivado');
    responderCarga(LOTES.slice(1));
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.remove(LOTES[1]);

    const borrado = http.expectOne(`${BATCHES}/2`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush(null, { status: 204, statusText: 'No Content' });

    expect(avisos).toContain('success:Lote eliminado');
    responderCarga(LOTES.slice(0, 1));
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    respuestaConfirmacion = 'reject';

    lista.deactivate(LOTES[0]);
    lista.remove(LOTES[0]);

    http.expectNone(`${BATCHES}/1/deactivate`);
    http.expectNone(`${BATCHES}/1`);
  });

  it('should keep the dialog open and warn when saving fails', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({ vaccine_id: 1, name: 'Falla' });

    http
      .expectOne(BATCHES)
      .flush({ error: 'Internal server error' }, { status: 500, statusText: 'Server Error' });

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(avisos).toContain('error:No se pudo guardar');
  });
});
