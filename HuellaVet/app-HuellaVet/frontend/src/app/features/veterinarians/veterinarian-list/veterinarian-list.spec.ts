import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Veterinarian } from '../../../core/models/veterinarian.model';
import { NotificationService } from '../../../core/services/notification';
import { VeterinarianList } from './veterinarian-list';

const BASE = `${environment.apiUrl}/veterinarios`;

const VETERINARIOS: Veterinarian[] = [
  { id: 1, name: 'Dra. Laura Gómez', description: 'Cirugía', is_active: true },
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

describe('VeterinarianList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    avisos.length = 0;
    respuestaConfirmacion = 'accept';

    await TestBed.configureTestingModule({
      imports: [VeterinarianList],
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

  async function crearLista(veterinarios: Veterinarian[] = VETERINARIOS) {
    const fixture = TestBed.createComponent(VeterinarianList);
    http.expectOne(BASE).flush({ veterinarians: veterinarios });
    await fixture.whenStable();
    return {
      fixture,
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should render one row per veterinarian', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('Dra. Laura Gómez');
  });

  it('should show the error, no rows and the empty state when the load fails', async () => {
    const fixture = TestBed.createComponent(VeterinarianList);
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

    lista.filter.set('cirugía');
    expect(lista.visibleRows().map((v) => v.id)).toEqual([1]);

    lista.filter.set('pedro');
    expect(lista.visibleRows().map((v) => v.id)).toEqual([2]);

    http.expectNone(BASE);
  });

  it('should POST a new veterinarian, close the dialog and reload', async () => {
    const { lista } = await crearLista();
    const cuerpo = { name: 'Nuevo', description: null, is_active: true };

    lista.openCreate();
    lista.save(cuerpo);

    const alta = http.expectOne(BASE);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(cuerpo);
    alta.flush({ veterinarian: { id: 3, ...cuerpo } });

    expect(lista.dialogVisible()).toBe(false);
    expect(avisos).toContain('success:Veterinario creado');
    http.expectOne(BASE).flush({ veterinarians: VETERINARIOS });
  });

  it('should PATCH the edited veterinarian and send no is_active', async () => {
    const { lista } = await crearLista();

    lista.openEdit(VETERINARIOS[0]);
    lista.save({ name: 'Dra. Laura G.', description: 'Cirugía' });

    const cambio = http.expectOne(`${BASE}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect('is_active' in (cambio.request.body as object)).toBe(false);
    cambio.flush({ veterinarian: VETERINARIOS[0] });

    expect(avisos).toContain('success:Veterinario actualizado');
    http.expectOne(BASE).flush({ veterinarians: VETERINARIOS });
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.deactivate(VETERINARIOS[0]);

    const baja = http.expectOne(`${BASE}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'ok', veterinarian: { ...VETERINARIOS[0], is_active: false } });

    expect(avisos).toContain('warn:Veterinario desactivado');
    http.expectOne(BASE).flush({ veterinarians: VETERINARIOS.slice(1) });
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.remove(VETERINARIOS[1]);

    const borrado = http.expectOne(`${BASE}/2`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush(null, { status: 204, statusText: 'No Content' });

    expect(avisos).toContain('success:Veterinario eliminado');
    http.expectOne(BASE).flush({ veterinarians: VETERINARIOS.slice(0, 1) });
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    respuestaConfirmacion = 'reject';

    lista.deactivate(VETERINARIOS[0]);
    lista.remove(VETERINARIOS[0]);

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
