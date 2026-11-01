import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Consultation } from '../../../core/models/consultation.model';
import { Recipe } from '../../../core/models/recipe.model';
import { NotificationService } from '../../../core/services/notification';
import { RecipeList } from './recipe-list';

const RECIPES = `${environment.apiUrl}/recetas`;
const CONS = `${environment.apiUrl}/consultas`;

const RECETAS: Recipe[] = [
  {
    id: 1,
    consultation_id: 1,
    name: 'Amoxicilina 250 mg',
    description: 'Cada 12 horas por 7 días',
    is_active: true,
  },
  { id: 2, consultation_id: 2, name: 'Desparasitante', description: null, is_active: true },
];

const CONSULTAS: Consultation[] = [
  { id: 1, appointment_id: 1, name: 'Consulta general', description: null, is_active: true },
  { id: 2, appointment_id: 2, name: 'Urgencia', description: null, is_active: true },
  { id: 3, appointment_id: 3, name: 'Consulta inactiva', description: null, is_active: false },
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

describe('RecipeList', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    avisos.length = 0;
    respuestaConfirmacion = 'accept';

    await TestBed.configureTestingModule({
      imports: [RecipeList],
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
  function responderCarga(recetas: Recipe[] = RECETAS) {
    http.expectOne(RECIPES).flush({ recipes: recetas });
    http.expectOne(CONS).flush({ consultations: CONSULTAS });
  }

  async function crearLista(recetas: Recipe[] = RECETAS) {
    const fixture = TestBed.createComponent(RecipeList);
    responderCarga(recetas);
    await fixture.whenStable();
    return {
      fixture,
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load recipes and consultations in parallel and render one row per recipe with the consultation name', async () => {
    const { compilado } = await crearLista();

    expect(compilado.querySelectorAll('tbody tr').length).toBe(2);
    expect(compilado.textContent).toContain('Amoxicilina 250 mg');
    expect(compilado.textContent).toContain('Consulta general');
    expect(compilado.textContent).toContain('Urgencia');
  });

  it('should fall back to the id when the consultation is unknown', async () => {
    const { lista } = await crearLista();

    expect(lista.consultationName()(99)).toBe('Consulta #99');
  });

  it('should show the error and no rows when the load fails', async () => {
    const fixture = TestBed.createComponent(RecipeList);
    http
      .expectOne(RECIPES)
      .flush({ error: 'Servidor caído' }, { status: 500, statusText: 'Internal Server Error' });
    // forkJoin cancela la otra petición al primer error.
    http.match(CONS);
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Servidor caído');
    expect(fixture.componentInstance.rows()).toEqual([]);
  });

  it('should filter locally by recipe, description and consultation name without new requests', async () => {
    const { lista } = await crearLista();

    lista.filter.set('urgencia');
    expect(lista.visibleRows().map((r) => r.id)).toEqual([2]);

    lista.filter.set('amoxicilina');
    expect(lista.visibleRows().map((r) => r.id)).toEqual([1]);

    lista.filter.set('cada 12');
    expect(lista.visibleRows().map((r) => r.id)).toEqual([1]);

    http.expectNone(RECIPES);
    http.expectNone(CONS);
  });

  it('should offer every active consultation, even those that already have recipes', async () => {
    const { lista } = await crearLista();

    expect(lista.formConsultations().map((c) => c.id)).toEqual([1, 2]);
  });

  it('should keep the inactive consultation of the recipe that is being edited', async () => {
    const { lista } = await crearLista();

    lista.openEdit({
      id: 7,
      consultation_id: 3,
      name: 'Receta vieja',
      description: null,
      is_active: true,
    });

    expect(lista.formConsultations().map((c) => c.id)).toEqual([1, 2, 3]);
  });

  it('should POST a new recipe with the numeric consultation_id, close the dialog and reload', async () => {
    const { lista } = await crearLista();
    const cuerpo = { consultation_id: 1, name: 'Nueva', description: null, is_active: true };

    lista.openCreate();
    lista.save(cuerpo);

    const alta = http.expectOne(RECIPES);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(cuerpo);
    alta.flush({ recipe: { id: 3, ...cuerpo } });

    expect(lista.dialogVisible()).toBe(false);
    expect(avisos).toContain('success:Receta creada');
    responderCarga();
  });

  it('should PATCH the edited recipe and send no is_active', async () => {
    const { lista } = await crearLista();

    lista.openEdit(RECETAS[0]);
    lista.save({
      consultation_id: 1,
      name: 'Amoxicilina 500 mg',
      description: 'Cada 12 horas por 7 días',
    });

    const cambio = http.expectOne(`${RECIPES}/1`);
    expect(cambio.request.method).toBe('PATCH');
    expect('is_active' in (cambio.request.body as object)).toBe(false);
    cambio.flush({ recipe: RECETAS[0] });

    expect(avisos).toContain('success:Receta actualizada');
    responderCarga();
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.deactivate(RECETAS[0]);

    const baja = http.expectOne(`${RECIPES}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'ok', recipe: { ...RECETAS[0], is_active: false } });

    expect(avisos).toContain('warn:Receta desactivada');
    responderCarga(RECETAS.slice(1));
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    lista.remove(RECETAS[1]);

    const borrado = http.expectOne(`${RECIPES}/2`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush(null, { status: 204, statusText: 'No Content' });

    expect(avisos).toContain('success:Receta eliminada');
    responderCarga(RECETAS.slice(0, 1));
  });

  it('should not touch the API when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    respuestaConfirmacion = 'reject';

    lista.deactivate(RECETAS[0]);
    lista.remove(RECETAS[0]);

    http.expectNone(`${RECIPES}/1/deactivate`);
    http.expectNone(`${RECIPES}/1`);
  });

  it('should keep the dialog open and warn when saving fails', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    lista.save({ consultation_id: 1, name: 'Falla' });

    http
      .expectOne(RECIPES)
      .flush({ error: 'Internal server error' }, { status: 500, statusText: 'Server Error' });

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(avisos).toContain('error:No se pudo guardar');
  });
});
