import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Owner } from '../../../core/models/owner.model';
import { Pet } from '../../../core/models/pet.model';
import { NotificationService } from '../../../core/services/notification';
import { PetList } from './pet-list';

const PETS = `${environment.apiUrl}/mascotas`;
const OWNERS = `${environment.apiUrl}/propietarios`;

const MASCOTAS: Pet[] = [
  { id: 1, owner_id: 1, name: 'Firulais', description: 'Labrador', is_active: true },
  { id: 2, owner_id: 2, name: 'Michi', description: null, is_active: true },
];

const PROPIETARIOS: Owner[] = [
  {
    id: 1,
    document_type: 'CC',
    document_number: '1001',
    name: 'Ana Pérez',
    phone: null,
    email: null,
    is_active: true,
  },
  {
    id: 2,
    document_type: 'CC',
    document_number: '2002',
    name: 'Luis Gómez',
    phone: null,
    email: null,
    is_active: true,
  },
  {
    id: 3,
    document_type: 'CC',
    document_number: '3003',
    name: 'Pedro Inactivo',
    phone: null,
    email: null,
    is_active: false,
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

describe('PetList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    avisos.length = 0;
    respuestaConfirmacion = 'accept';

    await TestBed.configureTestingModule({
      imports: [PetList],
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
  function responderCarga(mascotas: Pet[] = MASCOTAS, propietarios: Owner[] = PROPIETARIOS) {
    http.expectOne(PETS).flush({ pets: mascotas });
    http.expectOne(OWNERS).flush({ owners: propietarios });
  }

  async function crearLista(mascotas: Pet[] = MASCOTAS, propietarios: Owner[] = PROPIETARIOS) {
    const fixture = TestBed.createComponent(PetList);
    responderCarga(mascotas, propietarios);
    await fixture.whenStable();
    return {
      fixture,
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load pets and owners in parallel and render one row per pet', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('Firulais');
  });

  it('should show the owner name instead of the id', async () => {
    const { compilado } = await crearLista();

    expect(compilado.textContent).toContain('Ana Pérez');
    expect(compilado.textContent).toContain('Luis Gómez');
  });

  it('should fall back to the id when the owner is unknown', async () => {
    const { lista } = await crearLista([
      { id: 9, owner_id: 99, name: 'Huérfano', description: null, is_active: true },
    ]);

    expect(lista.ownerName()(99)).toBe('Propietario #99');
  });

  it('should show the error and no rows when the load fails', async () => {
    const fixture = TestBed.createComponent(PetList);
    http
      .expectOne(PETS)
      .flush({ error: 'Servidor caído' }, { status: 500, statusText: 'Internal Server Error' });
    // forkJoin cancela la otra petición al primer error.
    http.match(OWNERS);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Servidor caído');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should filter locally by pet, description and owner name without new requests', async () => {
    const { lista } = await crearLista();

    lista.filter.set('labrador');
    expect(lista.visibleRows().map((p) => p.id)).toEqual([1]);

    lista.filter.set('luis');
    expect(lista.visibleRows().map((p) => p.id)).toEqual([2]);

    http.expectNone(PETS);
    http.expectNone(OWNERS);
  });

  it('should offer only active owners in the form', async () => {
    const { lista } = await crearLista();

    expect(lista.formOwners().map((o) => o.id)).toEqual([1, 2]);
  });

  it('should keep the inactive owner of the pet that is being edited', async () => {
    const { lista } = await crearLista();

    lista.openEdit({ id: 7, owner_id: 3, name: 'Rex', description: null, is_active: true });

    expect(lista.formOwners().map((o) => o.id)).toEqual([1, 2, 3]);
  });

  it('should POST a new pet with the numeric owner_id, close the dialog and reload', async () => {
    const { lista } = await crearLista();
    const cuerpo = { owner_id: 1, name: 'Nueva', description: null, is_active: true };

    lista.openCreate();
    lista.save(cuerpo);

    const alta = http.expectOne(PETS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(cuerpo);
    alta.flush({ pet: { id: 3, ...cuerpo } });

    expect(lista.dialogVisible()).toBe(false);
    expect(avisos).toContain('success:Mascota creada');
    responderCarga();
  });

  it('should PATCH the edited pet and send no is_active', async () => {
    const { lista } = await crearLista();

    lista.openEdit(MASCOTAS[0]);
    lista.save({ owner_id: 1, name: 'Firulais II', description: 'Labrador' });

    const cambio = http.expectOne(`${PETS}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect('is_active' in (cambio.request.body as object)).toBe(false);
    cambio.flush({ pet: MASCOTAS[0] });

    expect(avisos).toContain('success:Mascota actualizada');
    responderCarga();
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.deactivate(MASCOTAS[0]);

    const baja = http.expectOne(`${PETS}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'ok', pet: { ...MASCOTAS[0], is_active: false } });

    expect(avisos).toContain('warn:Mascota desactivada');
    responderCarga(MASCOTAS.slice(1));
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.remove(MASCOTAS[1]);

    const borrado = http.expectOne(`${PETS}/2`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush(null, { status: 204, statusText: 'No Content' });

    expect(avisos).toContain('success:Mascota eliminada');
    responderCarga(MASCOTAS.slice(0, 1));
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    respuestaConfirmacion = 'reject';

    lista.deactivate(MASCOTAS[0]);
    lista.remove(MASCOTAS[0]);

    http.expectNone(`${PETS}/1/deactivate`);
    http.expectNone(`${PETS}/1`);
  });

  it('should keep the dialog open and warn when saving fails', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({ owner_id: 1, name: 'Falla' });

    http
      .expectOne(PETS)
      .flush({ error: 'Internal server error' }, { status: 500, statusText: 'Server Error' });

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(avisos).toContain('error:No se pudo guardar');
  });
});
