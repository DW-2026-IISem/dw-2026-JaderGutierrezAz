import { TestBed } from '@angular/core/testing';
import { Consultation } from '../../../core/models/consultation.model';
import { Recipe, RecipeCreate } from '../../../core/models/recipe.model';
import { RecipeForm } from './recipe-form';

const CONSULTAS: Consultation[] = [
  { id: 1, appointment_id: 1, name: 'Consulta general', description: null, is_active: true },
  { id: 2, appointment_id: 2, name: 'Urgencia', description: null, is_active: true },
];

const RECETA: Recipe = {
  id: 5,
  consultation_id: 2,
  name: 'Amoxicilina 250 mg',
  description: 'Cada 12 horas por 7 días',
  is_active: true,
};

describe('RecipeForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [RecipeForm] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(RecipeForm);
    fixture.componentRef.setInput('consultations', CONSULTAS);
    await fixture.whenStable();
    return { fixture, componente: fixture.componentInstance };
  }

  it('should start empty, in creation mode and invalid', async () => {
    const { componente } = await crear();

    expect(componente.form.controls.consultation_id.value).toBeNull();
    expect(componente.form.controls.name.value).toBe('');
    expect(componente.form.controls.is_active.disabled).toBe(false);
    expect(componente.form.invalid).toBe(true);
  });

  it('should label each consultation option with its id and name', async () => {
    const { componente } = await crear();

    expect(componente.consultationOptions()).toEqual([
      { id: 1, label: '#1 · Consulta general' },
      { id: 2, label: '#2 · Urgencia' },
    ]);
  });

  it('should not emit and should mark the fields as touched when it is invalid', async () => {
    const { componente } = await crear();
    const emitidos: RecipeCreate[] = [];
    componente.saved.subscribe((cuerpo) => emitidos.push(cuerpo));

    componente.submit();

    expect(emitidos).toEqual([]);
    expect(componente.form.controls.consultation_id.touched).toBe(true);
    expect(componente.form.controls.name.touched).toBe(true);
  });

  it('should require a consultation even when the name is valid', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ name: 'Amoxicilina' });
    expect(componente.form.controls.consultation_id.invalid).toBe(true);

    componente.form.patchValue({ consultation_id: 1 });
    expect(componente.form.valid).toBe(true);
  });

  it('should reject a name made only of spaces', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ consultation_id: 1, name: '   ' });

    expect(componente.form.controls.name.invalid).toBe(true);
  });

  it('should emit the trimmed body with a numeric consultation_id and is_active when creating', async () => {
    const { componente } = await crear();
    let cuerpo: RecipeCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.setValue({
      consultation_id: 1,
      name: ' Amoxicilina 250 mg ',
      description: ' Cada 12 horas ',
      is_active: true,
    });
    componente.submit();

    expect(cuerpo).toEqual({
      consultation_id: 1,
      name: 'Amoxicilina 250 mg',
      description: 'Cada 12 horas',
      is_active: true,
    });
    expect(typeof cuerpo?.consultation_id).toBe('number');
  });

  it('should send an empty description as null', async () => {
    const { componente } = await crear();
    let cuerpo: RecipeCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.patchValue({ consultation_id: 1, name: 'Sin descripción' });
    componente.submit();

    expect(cuerpo?.description).toBeNull();
  });

  it('should load the recipe in edit mode, lock is_active and leave it out of the body', async () => {
    const { fixture, componente } = await crear();
    let cuerpo: RecipeCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    fixture.componentRef.setInput('recipe', RECETA);
    await fixture.whenStable();

    expect(componente.form.controls.consultation_id.value).toBe(2);
    expect(componente.form.controls.is_active.disabled).toBe(true);

    componente.submit();

    expect(cuerpo).toEqual({
      consultation_id: 2,
      name: 'Amoxicilina 250 mg',
      description: 'Cada 12 horas por 7 días',
    });
  });

  it('should reset the form when resetKey changes', async () => {
    const { fixture, componente } = await crear();

    componente.form.patchValue({ name: 'Texto de una apertura anterior' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(componente.form.controls.name.value).toBe('');
  });
});
