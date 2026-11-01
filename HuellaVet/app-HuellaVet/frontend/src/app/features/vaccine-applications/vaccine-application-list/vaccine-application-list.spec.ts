import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Consultation } from '../../../core/models/consultation.model';
import { Vaccine } from '../../../core/models/vaccine.model';
import { VaccineApplication } from '../../../core/models/vaccine-application.model';
import { VaccineBatch } from '../../../core/models/vaccine-batch.model';
import { NotificationService } from '../../../core/services/notification';
import { VaccineApplicationList } from './vaccine-application-list';

const APPS = `${environment.apiUrl}/aplicaciones-vacunas`;
const CONS = `${environment.apiUrl}/consultas`;
const BATCHES = `${environment.apiUrl}/lotes-vacunas`;
const VACCINES = `${environment.apiUrl}/vacunas`;

const APLICACIONES: VaccineApplication[] = [
  {
    id: 1,
    consultation_id: 1,
    vaccine_batch_id: 1,
    name: 'Dosis 1',
    description: 'Primera dosis',
    is_active: true,
  },
  {
    id: 2,
    consultation_id: 2,
    vaccine_batch_id: 2,
    name: 'Refuerzo',
    description: null,
    is_active: true,
  },
];

const CONSULTAS: Consultation[] = [
  { id: 1, appointment_id: 1, name: 'Consulta general', description: null, is_active: true },
  { id: 2, appointment_id: 2, name: 'Urgencia', description: null, is_active: true },
  { id: 3, appointment_id: 3, name: 'Consulta inactiva', description: null, is_active: false },
];

const LOTES: VaccineBatch[] = [
  { id: 1, vaccine_id: 1, name: 'Lote A-001', description: null, is_active: true },
  { id: 2, vaccine_id: 2, name: 'Lote B-002', description: null, is_active: true },
  { id: 3, vaccine_id: 1, name: 'Lote inactivo', description: null, is_active: false },
];

const VACUNAS: Vaccine[] = [
  { id: 1, name: 'Antirrábica', description: null, is_active: true },
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

describe('VaccineApplicationList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    avisos.length = 0;
    respuestaConfirmacion = 'accept';

    await TestBed.configureTestingModule({
      imports: [VaccineApplicationList],
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

  /** Responde las cuatro peticiones en paralelo que hace `load()`. */
  function responderCarga(aplicaciones: VaccineApplication[] = APLICACIONES) {
    http.expectOne(APPS).flush({ vaccineApplications: aplicaciones });
    http.expectOne(CONS).flush({ consultations: CONSULTAS });
    http.expectOne(BATCHES).flush({ vaccineBatches: LOTES });
    http.expectOne(VACCINES).flush({ vaccines: VACUNAS });
  }

  async function crearLista(aplicaciones: VaccineApplication[] = APLICACIONES) {
    const fixture = TestBed.createComponent(VaccineApplicationList);
    responderCarga(aplicaciones);
    await fixture.whenStable();
    return {
      fixture,
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load the four resources and render one row per application with consultation, batch and vaccine', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('Dosis 1');
    expect(compilado.textContent).toContain('Consulta general');
    expect(compilado.textContent).toContain('Lote A-001');
    expect(compilado.textContent).toContain('Antirrábica');
  });

  it('should fall back to the id when the consultation or the batch is unknown', async () => {
    const { lista } = await crearLista();

    expect(lista.consultationName()(99)).toBe('Consulta #99');
    expect(lista.batchInfo()(99).batch).toBe('Lote #99');
  });

  it('should show the error and no rows when the load fails', async () => {
    const fixture = TestBed.createComponent(VaccineApplicationList);
    http
      .expectOne(APPS)
      .flush({ error: 'Servidor caído' }, { status: 500, statusText: 'Internal Server Error' });
    http.match(CONS);
    http.match(BATCHES);
    http.match(VACCINES);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Servidor caído');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should filter locally by application, consultation, batch and vaccine without new requests', async () => {
    const { lista } = await crearLista();

    lista.filter.set('urgencia');
    expect(lista.visibleRows().map((a) => a.id)).toEqual([2]);

    lista.filter.set('antirrábica');
    expect(lista.visibleRows().map((a) => a.id)).toEqual([1]);

    lista.filter.set('primera');
    expect(lista.visibleRows().map((a) => a.id)).toEqual([1]);

    http.expectNone(APPS);
  });

  it('should offer only active consultations and batches, with the vaccine in the batch label', async () => {
    const { lista } = await crearLista();

    expect(lista.consultationOptions().map((o) => o.id)).toEqual([1, 2]);
    expect(lista.batchOptions().map((o) => o.id)).toEqual([1, 2]);
    expect(lista.batchOptions()[0].label).toContain('Antirrábica');
  });

  it('should keep the inactive consultation and batch of the application that is being edited', async () => {
    const { lista } = await crearLista();

    lista.openEdit({
      id: 7,
      consultation_id: 3,
      vaccine_batch_id: 3,
      name: 'Antigua',
      description: null,
      is_active: true,
    });

    expect(lista.consultationOptions().map((o) => o.id)).toEqual([1, 2, 3]);
    expect(lista.batchOptions().map((o) => o.id)).toEqual([1, 2, 3]);
  });

  it('should POST a new application with numeric ids, close the dialog and reload', async () => {
    const { lista } = await crearLista();
    const cuerpo = {
      consultation_id: 1,
      vaccine_batch_id: 2,
      name: 'Nueva',
      description: null,
      is_active: true,
    };

    lista.openCreate();
    lista.save(cuerpo);

    const alta = http.expectOne(APPS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(cuerpo);
    alta.flush({ vaccineApplication: { id: 3, ...cuerpo } });

    expect(lista.dialogVisible()).toBe(false);
    expect(avisos).toContain('success:Aplicación creada');
    responderCarga();
  });

  it('should PATCH the edited application and send no is_active', async () => {
    const { lista } = await crearLista();

    lista.openEdit(APLICACIONES[0]);
    lista.save({
      consultation_id: 1,
      vaccine_batch_id: 1,
      name: 'Dosis 1 bis',
      description: 'Primera dosis',
    });

    const cambio = http.expectOne(`${APPS}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect('is_active' in (cambio.request.body as object)).toBe(false);
    cambio.flush({ vaccineApplication: APLICACIONES[0] });

    expect(avisos).toContain('success:Aplicación actualizada');
    responderCarga();
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.deactivate(APLICACIONES[0]);

    const baja = http.expectOne(`${APPS}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'ok', vaccineApplication: { ...APLICACIONES[0], is_active: false } });

    expect(avisos).toContain('warn:Aplicación desactivada');
    responderCarga(APLICACIONES.slice(1));
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.remove(APLICACIONES[1]);

    const borrado = http.expectOne(`${APPS}/2`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush(null, { status: 204, statusText: 'No Content' });

    expect(avisos).toContain('success:Aplicación eliminada');
    responderCarga(APLICACIONES.slice(0, 1));
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    respuestaConfirmacion = 'reject';

    lista.deactivate(APLICACIONES[0]);
    lista.remove(APLICACIONES[0]);

    http.expectNone(`${APPS}/1/deactivate`);
    http.expectNone(`${APPS}/1`);
  });

  it('should keep the dialog open and warn when saving fails', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({ consultation_id: 1, vaccine_batch_id: 1, name: 'Falla' });

    http
      .expectOne(APPS)
      .flush({ error: 'Internal server error' }, { status: 500, statusText: 'Server Error' });

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(avisos).toContain('error:No se pudo guardar');
  });
});
