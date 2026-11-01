import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Appointment } from '../../../core/models/appointment.model';
import { Pay } from '../../../core/models/pay.model';
import { NotificationService } from '../../../core/services/notification';
import { PayList } from './pay-list';

const PAYS = `${environment.apiUrl}/pagos`;
const APPOINTMENTS = `${environment.apiUrl}/citas`;

const PAGOS: Pay[] = [
  {
    id: 1,
    reference_type: 'appointment',
    reference_id: 1,
    method: 'Efectivo',
    amount: '85000.00',
    date: '2026-10-05T09:35:00.000Z',
    state: 'pending',
  },
  {
    id: 2,
    reference_type: 'appointment',
    reference_id: 2,
    method: 'Tarjeta',
    amount: '50000.00',
    date: '2026-10-06T10:35:00.000Z',
    state: 'paid',
  },
];

const CITAS: Appointment[] = [
  {
    id: 1,
    pet_id: 1,
    veterinarian_id: 1,
    start_date: '2026-10-05T09:00:00.000Z',
    end_date: '2026-10-05T09:30:00.000Z',
    reason: 'Control',
    state: 'scheduled',
  },
  {
    id: 2,
    pet_id: 2,
    veterinarian_id: 1,
    start_date: '2026-10-06T10:00:00.000Z',
    end_date: '2026-10-06T10:30:00.000Z',
    reason: 'Vacunación',
    state: 'completed',
  },
  {
    id: 3,
    pet_id: 3,
    veterinarian_id: 1,
    start_date: '2026-10-07T11:00:00.000Z',
    end_date: '2026-10-07T11:30:00.000Z',
    reason: 'Cancelada',
    state: 'cancelled',
  },
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

describe('PayList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    avisos.length = 0;
    respuestaConfirmacion = 'accept';

    await TestBed.configureTestingModule({
      imports: [PayList],
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
  function responderCarga(pagos: Pay[] = PAGOS, citas: Appointment[] = CITAS) {
    http.expectOne(PAYS).flush({ pays: pagos });
    http.expectOne(APPOINTMENTS).flush({ appointments: citas });
  }

  async function crearLista(pagos: Pay[] = PAGOS, citas: Appointment[] = CITAS) {
    const fixture = TestBed.createComponent(PayList);
    responderCarga(pagos, citas);
    await fixture.whenStable();
    return {
      fixture,
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load payments and appointments in parallel and render one row per payment with its appointment', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('Efectivo');
    expect(compilado.textContent).toContain('Cita #1 · Control');
    expect(compilado.textContent).toContain('Cita #2 · Vacunación');
    expect(compilado.textContent).toContain('Pendiente');
    expect(compilado.textContent).toContain('Pagado');
  });

  it('should fall back to the id when the appointment is unknown', async () => {
    const { lista } = await crearLista([
      { ...PAGOS[0], id: 9, reference_id: 99 },
    ]);

    expect(lista.appointmentLabel()(99)).toBe('Cita #99');
  });

  it('should show the error and no rows when the load fails', async () => {
    const fixture = TestBed.createComponent(PayList);
    http
      .expectOne(PAYS)
      .flush({ error: 'Servidor caído' }, { status: 500, statusText: 'Internal Server Error' });
    // forkJoin cancela la otra petición al primer error.
    http.match(APPOINTMENTS);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Servidor caído');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should filter locally by method, amount, appointment and state without new requests', async () => {
    const { lista } = await crearLista();

    lista.filter.set('tarjeta');
    expect(lista.visibleRows().map((p) => p.id)).toEqual([2]);

    lista.filter.set('control');
    expect(lista.visibleRows().map((p) => p.id)).toEqual([1]);

    lista.filter.set('85000');
    expect(lista.visibleRows().map((p) => p.id)).toEqual([1]);

    lista.filter.set('pagado');
    expect(lista.visibleRows().map((p) => p.id)).toEqual([2]);

    http.expectNone(PAYS);
    http.expectNone(APPOINTMENTS);
  });

  it('should offer only non-cancelled appointments in the form', async () => {
    const { lista } = await crearLista();

    expect(lista.formAppointments().map((c) => c.id)).toEqual([1, 2]);
  });

  it('should keep the cancelled appointment of the payment that is being edited', async () => {
    const { lista } = await crearLista();

    lista.openEdit({ ...PAGOS[0], id: 7, reference_id: 3 });

    expect(lista.formAppointments().map((c) => c.id)).toEqual([1, 2, 3]);
  });

  it('should POST a new payment with numeric ids and state, close the dialog and reload', async () => {
    const { lista } = await crearLista();
    const cuerpo = {
      reference_type: 'appointment' as const,
      reference_id: 1,
      method: 'Efectivo',
      amount: 50000,
      date: '2026-11-01T15:00:00.000Z',
      state: 'pending' as const,
    };

    lista.openCreate();
    lista.save(cuerpo);

    const alta = http.expectOne(PAYS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(cuerpo);
    alta.flush({ pay: { id: 3, ...cuerpo, amount: '50000.00' } });

    expect(lista.dialogVisible()).toBe(false);
    expect(avisos).toContain('success:Pago creado');
    responderCarga();
  });

  it('should PATCH the edited payment and send no state', async () => {
    const { lista } = await crearLista();

    lista.openEdit(PAGOS[0]);
    lista.save({
      reference_type: 'appointment',
      reference_id: 1,
      method: 'Efectivo',
      amount: 90000,
      date: '2026-10-05T09:35:00.000Z',
    });

    const cambio = http.expectOne(`${PAYS}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect('state' in (cambio.request.body as object)).toBe(false);
    cambio.flush({ pay: PAGOS[0] });

    expect(avisos).toContain('success:Pago actualizado');
    responderCarga();
  });

  it('should PATCH only { state: "paid" } after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.markPaid(PAGOS[0]);

    const cambio = http.expectOne(`${PAYS}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect(cambio.request.body).toEqual({ state: 'paid' });
    cambio.flush({ pay: { ...PAGOS[0], state: 'paid' } });

    expect(avisos).toContain('success:Pago marcado como pagado');
    responderCarga();
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.deactivate(PAGOS[0]);

    const baja = http.expectOne(`${PAYS}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Pay cancelled (logical delete)', pay: { ...PAGOS[0], state: 'cancelled' } });

    expect(avisos).toContain('warn:Pago cancelado');
    responderCarga(PAGOS.slice(1));
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.remove(PAGOS[1]);

    const borrado = http.expectOne(`${PAYS}/2`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'Pay permanently deleted', id: 2 });

    expect(avisos).toContain('success:Pago eliminado');
    responderCarga(PAGOS.slice(0, 1));
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    respuestaConfirmacion = 'reject';

    lista.markPaid(PAGOS[0]);
    lista.deactivate(PAGOS[0]);
    lista.remove(PAGOS[0]);

    http.expectNone(`${PAYS}/1`);
    http.expectNone(`${PAYS}/1/deactivate`);
  });

  it('should keep the dialog open and warn when saving fails', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({
      reference_type: 'appointment',
      reference_id: 99999,
      method: 'Efectivo',
      amount: 1,
      date: '2026-11-01T15:00:00.000Z',
    });

    http
      .expectOne(PAYS)
      .flush(
        { error: 'Referenced appointment not found' },
        { status: 404, statusText: 'Not Found' },
      );

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(avisos).toContain('error:No se pudo guardar');
  });
});
