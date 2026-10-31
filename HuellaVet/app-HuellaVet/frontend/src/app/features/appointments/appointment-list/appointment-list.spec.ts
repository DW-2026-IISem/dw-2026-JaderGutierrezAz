import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Appointment } from '../../../core/models/appointment.model';
import { Owner } from '../../../core/models/owner.model';
import { Pet } from '../../../core/models/pet.model';
import { Veterinarian } from '../../../core/models/veterinarian.model';
import { NotificationService } from '../../../core/services/notification';
import { AppointmentList } from './appointment-list';

const APPTS = `${environment.apiUrl}/citas`;
const PETS = `${environment.apiUrl}/mascotas`;
const VETS = `${environment.apiUrl}/veterinarios`;
const OWNERS = `${environment.apiUrl}/propietarios`;

const CITAS: Appointment[] = [
  {
    id: 1,
    pet_id: 1,
    veterinarian_id: 1,
    start_date: '2030-01-15T14:00:00.000Z',
    end_date: '2030-01-15T15:00:00.000Z',
    reason: 'Control anual',
    state: 'scheduled',
  },
  {
    id: 2,
    pet_id: 2,
    veterinarian_id: 2,
    start_date: '2030-01-16T14:00:00.000Z',
    end_date: '2030-01-16T15:00:00.000Z',
    reason: 'Vacunación',
    state: 'completed',
  },
];

const MASCOTAS: Pet[] = [
  { id: 1, owner_id: 1, name: 'Firulais', description: null, is_active: true },
  { id: 2, owner_id: 2, name: 'Michi', description: null, is_active: true },
  { id: 3, owner_id: 1, name: 'Rex', description: null, is_active: false },
];

const VETERINARIOS: Veterinarian[] = [
  { id: 1, name: 'Dra. Laura Gómez', description: null, is_active: true },
  { id: 2, name: 'Dr. Pedro Ruiz', description: null, is_active: true },
  { id: 3, name: 'Dr. Inactivo', description: null, is_active: false },
];

const PROPIETARIOS: Owner[] = [
  { id: 1, document_type: 'CC', document_number: '1001', name: 'Ana Pérez', phone: null, email: null, is_active: true },
  { id: 2, document_type: 'CC', document_number: '2002', name: 'Luis Gómez', phone: null, email: null, is_active: true },
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

describe('AppointmentList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    avisos.length = 0;
    respuestaConfirmacion = 'accept';

    await TestBed.configureTestingModule({
      imports: [AppointmentList],
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
  function responderCarga(citas: Appointment[] = CITAS) {
    http.expectOne(APPTS).flush({ appointments: citas });
    http.expectOne(PETS).flush({ pets: MASCOTAS });
    http.expectOne(VETS).flush({ veterinarians: VETERINARIOS });
    http.expectOne(OWNERS).flush({ owners: PROPIETARIOS });
  }

  async function crearLista(citas: Appointment[] = CITAS) {
    const fixture = TestBed.createComponent(AppointmentList);
    responderCarga(citas);
    await fixture.whenStable();
    return {
      fixture,
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load the four resources and render one row per appointment with names', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('Firulais');
    expect(compilado.textContent).toContain('Ana Pérez');
    expect(compilado.textContent).toContain('Dra. Laura Gómez');
    expect(compilado.textContent).toContain('Programada');
    expect(compilado.textContent).toContain('Completada');
  });

  it('should show the error and no rows when the load fails', async () => {
    const fixture = TestBed.createComponent(AppointmentList);
    http
      .expectOne(APPTS)
      .flush({ error: 'Servidor caído' }, { status: 500, statusText: 'Internal Server Error' });
    http.match(PETS);
    http.match(VETS);
    http.match(OWNERS);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Servidor caído');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should filter locally by pet, owner, veterinarian, reason and state', async () => {
    const { lista } = await crearLista();

    lista.filter.set('michi');
    expect(lista.visibleRows().map((c) => c.id)).toEqual([2]);

    lista.filter.set('laura');
    expect(lista.visibleRows().map((c) => c.id)).toEqual([1]);

    lista.filter.set('completada');
    expect(lista.visibleRows().map((c) => c.id)).toEqual([2]);

    http.expectNone(APPTS);
  });

  it('should offer only active pets and veterinarians, keeping those of the edited appointment', async () => {
    const { lista } = await crearLista();

    expect(lista.petOptions().map((o) => o.id)).toEqual([1, 2]);
    expect(lista.vetOptions().map((o) => o.id)).toEqual([1, 2]);
    expect(lista.petOptions()[0].label).toBe('Firulais · Ana Pérez');

    lista.openEdit({ ...CITAS[0], pet_id: 3, veterinarian_id: 3 });

    expect(lista.petOptions().map((o) => o.id)).toEqual([1, 2, 3]);
    expect(lista.vetOptions().map((o) => o.id)).toEqual([1, 2, 3]);
  });

  it('should POST a new appointment, close the dialog and reload', async () => {
    const { lista } = await crearLista();
    const cuerpo = {
      pet_id: 1,
      veterinarian_id: 1,
      start_date: '2030-01-15T15:00:00.000Z',
      end_date: '2030-01-15T16:00:00.000Z',
      reason: 'Seguimiento',
      state: 'scheduled' as const,
    };

    lista.openCreate();
    lista.save(cuerpo);

    const alta = http.expectOne(APPTS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(cuerpo);
    alta.flush({ appointment: { id: 3, ...cuerpo } });

    expect(lista.dialogVisible()).toBe(false);
    expect(avisos).toContain('success:Cita creada');
    responderCarga();
  });

  it('should block a overlapping appointment of the same veterinarian without sending it', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({
      pet_id: 2,
      veterinarian_id: 1,
      start_date: '2030-01-15T14:30:00.000Z',
      end_date: '2030-01-15T15:30:00.000Z',
      reason: 'Solapada',
      state: 'scheduled',
    });

    http.expectNone(APPTS);
    expect(avisos).toContain('warn:Horario ocupado');
    expect(lista.dialogVisible()).toBe(true);
  });

  it('should PATCH the edited appointment and not collide with itself', async () => {
    const { lista } = await crearLista();

    lista.openEdit(CITAS[0]);
    lista.save({
      pet_id: 1,
      veterinarian_id: 1,
      start_date: CITAS[0].start_date,
      end_date: CITAS[0].end_date,
      reason: 'Control anual (editado)',
      state: 'scheduled',
    });

    const cambio = http.expectOne(`${APPTS}/1`);
    expect(cambio.request.method).toBe('PATCH');
    cambio.flush({ appointment: CITAS[0] });

    expect(avisos).toContain('success:Cita actualizada');
    responderCarga();
  });

  it('should complete an appointment with a PATCH that carries the state', async () => {
    const { lista } = await crearLista();

    lista.complete(CITAS[0]);

    const cambio = http.expectOne(`${APPTS}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect(cambio.request.body).toEqual({ state: 'completed' });
    cambio.flush({ appointment: { ...CITAS[0], state: 'completed' } });

    expect(avisos).toContain('success:Cita completada');
    responderCarga();
  });

  it('should cancel an appointment with PATCH /deactivate after the confirmation', async () => {
    const { lista } = await crearLista();

    lista.cancel(CITAS[0]);

    const baja = http.expectOne(`${APPTS}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'ok', appointment: { ...CITAS[0], state: 'cancelled' } });

    expect(avisos).toContain('warn:Cita cancelada');
    responderCarga();
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.remove(CITAS[1]);

    const borrado = http.expectOne(`${APPTS}/2`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush(null, { status: 204, statusText: 'No Content' });

    expect(avisos).toContain('success:Cita eliminada');
    responderCarga(CITAS.slice(0, 1));
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    respuestaConfirmacion = 'reject';

    lista.complete(CITAS[0]);
    lista.cancel(CITAS[0]);
    lista.remove(CITAS[0]);

    http.expectNone(`${APPTS}/1`);
    http.expectNone(`${APPTS}/1/deactivate`);
  });

  it('should keep the dialog open and warn when saving fails', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({
      pet_id: 1,
      veterinarian_id: 2,
      start_date: '2031-05-01T14:00:00.000Z',
      end_date: '2031-05-01T15:00:00.000Z',
      reason: 'Falla',
      state: 'scheduled',
    });

    http
      .expectOne(APPTS)
      .flush({ error: 'Internal server error' }, { status: 500, statusText: 'Server Error' });

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(avisos).toContain('error:No se pudo guardar');
  });
});
