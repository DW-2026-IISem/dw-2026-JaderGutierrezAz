import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Appointment } from '../../../core/models/appointment.model';
import { Consultation } from '../../../core/models/consultation.model';
import { Pet } from '../../../core/models/pet.model';
import { Veterinarian } from '../../../core/models/veterinarian.model';
import { NotificationService } from '../../../core/services/notification';
import { ConsultationList } from './consultation-list';

const CONS = `${environment.apiUrl}/consultas`;
const APPTS = `${environment.apiUrl}/citas`;
const PETS = `${environment.apiUrl}/mascotas`;
const VETS = `${environment.apiUrl}/veterinarios`;

const cita = (
  id: number,
  pet_id: number,
  veterinarian_id: number,
  state: Appointment['state'],
): Appointment => ({
  id,
  pet_id,
  veterinarian_id,
  start_date: '2030-01-15T14:00:00.000Z',
  end_date: '2030-01-15T15:00:00.000Z',
  reason: 'Control',
  state,
});

/** 1 y 2 ya tienen consulta; 3 está libre; 4 está libre pero cancelada. */
const CITAS: Appointment[] = [
  cita(1, 1, 1, 'scheduled'),
  cita(2, 2, 2, 'completed'),
  cita(3, 1, 2, 'scheduled'),
  cita(4, 2, 1, 'cancelled'),
];

const CONSULTAS: Consultation[] = [
  { id: 1, appointment_id: 1, name: 'Consulta general', description: 'Sin hallazgos', is_active: true },
  { id: 2, appointment_id: 2, name: 'Vacunación anual', description: null, is_active: true },
];

const MASCOTAS: Pet[] = [
  { id: 1, owner_id: 1, name: 'Firulais', description: null, is_active: true },
  { id: 2, owner_id: 2, name: 'Michi', description: null, is_active: true },
];

const VETERINARIOS: Veterinarian[] = [
  { id: 1, name: 'Dra. Laura Gómez', description: null, is_active: true },
  { id: 2, name: 'Dr. Pedro Ruiz', description: null, is_active: true },
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

describe('ConsultationList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    avisos.length = 0;
    respuestaConfirmacion = 'accept';

    await TestBed.configureTestingModule({
      imports: [ConsultationList],
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
  function responderCarga(consultas: Consultation[] = CONSULTAS) {
    http.expectOne(CONS).flush({ consultations: consultas });
    http.expectOne(APPTS).flush({ appointments: CITAS });
    http.expectOne(PETS).flush({ pets: MASCOTAS });
    http.expectOne(VETS).flush({ veterinarians: VETERINARIOS });
  }

  async function crearLista(consultas: Consultation[] = CONSULTAS) {
    const fixture = TestBed.createComponent(ConsultationList);
    responderCarga(consultas);
    await fixture.whenStable();
    return {
      fixture,
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load the four resources and render one row per consultation with the appointment data', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('Consulta general');
    expect(compilado.textContent).toContain('Firulais');
    expect(compilado.textContent).toContain('Dra. Laura Gómez');
  });

  it('should show the error and no rows when the load fails', async () => {
    const fixture = TestBed.createComponent(ConsultationList);
    http
      .expectOne(CONS)
      .flush({ error: 'Servidor caído' }, { status: 500, statusText: 'Internal Server Error' });
    http.match(APPTS);
    http.match(PETS);
    http.match(VETS);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Servidor caído');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should filter locally by name, description, pet and veterinarian', async () => {
    const { lista } = await crearLista();

    lista.filter.set('michi');
    expect(lista.visibleRows().map((c) => c.id)).toEqual([2]);

    lista.filter.set('laura');
    expect(lista.visibleRows().map((c) => c.id)).toEqual([1]);

    lista.filter.set('vacunación');
    expect(lista.visibleRows().map((c) => c.id)).toEqual([2]);

    http.expectNone(CONS);
  });

  it('should offer only appointments without a consultation that are not cancelled', async () => {
    const { lista } = await crearLista();

    expect(lista.appointmentOptions().map((o) => o.id)).toEqual([3]);
    expect(lista.appointmentOptions()[0].label).toContain('Firulais');
    expect(lista.appointmentOptions()[0].label).toContain('Dr. Pedro Ruiz');
  });

  it('should keep the appointment of the consultation that is being edited', async () => {
    const { lista } = await crearLista();

    lista.openEdit(CONSULTAS[0]);

    expect(lista.appointmentOptions().map((o) => o.id)).toEqual([1, 3]);
  });

  it('should POST a new consultation with the numeric appointment_id, close the dialog and reload', async () => {
    const { lista } = await crearLista();
    const cuerpo = { appointment_id: 3, name: 'Nueva', description: null, is_active: true };

    lista.openCreate();
    lista.save(cuerpo);

    const alta = http.expectOne(CONS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(cuerpo);
    alta.flush({ consultation: { id: 3, ...cuerpo } });

    expect(lista.dialogVisible()).toBe(false);
    expect(avisos).toContain('success:Consulta creada');
    responderCarga();
  });

  it('should PATCH the edited consultation and send no is_active', async () => {
    const { lista } = await crearLista();

    lista.openEdit(CONSULTAS[0]);
    lista.save({ appointment_id: 1, name: 'Consulta general II', description: 'Sin hallazgos' });

    const cambio = http.expectOne(`${CONS}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect('is_active' in (cambio.request.body as object)).toBe(false);
    cambio.flush({ consultation: CONSULTAS[0] });

    expect(avisos).toContain('success:Consulta actualizada');
    responderCarga();
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.deactivate(CONSULTAS[0]);

    const baja = http.expectOne(`${CONS}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'ok', consultation: { ...CONSULTAS[0], is_active: false } });

    expect(avisos).toContain('warn:Consulta desactivada');
    responderCarga(CONSULTAS.slice(1));
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.remove(CONSULTAS[1]);

    const borrado = http.expectOne(`${CONS}/2`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush(null, { status: 204, statusText: 'No Content' });

    expect(avisos).toContain('success:Consulta eliminada');
    responderCarga(CONSULTAS.slice(0, 1));
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    respuestaConfirmacion = 'reject';

    lista.deactivate(CONSULTAS[0]);
    lista.remove(CONSULTAS[0]);

    http.expectNone(`${CONS}/1/deactivate`);
    http.expectNone(`${CONS}/1`);
  });

  it('should keep the dialog open and warn when saving fails', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({ appointment_id: 3, name: 'Falla' });

    http
      .expectOne(CONS)
      .flush({ error: 'Internal server error' }, { status: 500, statusText: 'Server Error' });

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(avisos).toContain('error:No se pudo guardar');
  });
});
