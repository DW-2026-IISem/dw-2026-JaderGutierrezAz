import { Component, computed, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Consultation } from '../../../core/models/consultation.model';
import { Recipe, RecipeCreate } from '../../../core/models/recipe.model';

/**
 * Formulario de receta, reutilizado para crear y editar.
 *
 * No llama a la API: recibe la receta, las consultas elegibles y emite el cuerpo con
 * `saved`. Tu backend responde 500 a un cuerpo incompleto, así que las validaciones
 * de aquí son la única barrera.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-recipe-form',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css',
})
export class RecipeForm {
  /** Receta a editar. `null` deja el formulario en modo creación. */
  readonly recipe = input<Recipe | null>(null);

  /** Consultas que se pueden elegir (el padre ya filtró las inactivas). */
  readonly consultations = input<Consultation[]>([]);

  /** Cambia en cada apertura del diálogo: fuerza a reiniciar el formulario. */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<RecipeCreate>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  /** `p-select` necesita una etiqueta plana: el id distingue consultas con el mismo nombre. */
  readonly consultationOptions = computed(() =>
    this.consultations().map((consultation) => ({
      id: consultation.id,
      label: `#${consultation.id} · ${consultation.name}`,
    })),
  );

  readonly stateOptions = [
    { label: 'Activa', value: true },
    { label: 'Inactiva', value: false },
  ];

  readonly form = this.fb.group({
    consultation_id: [null as number | null, [Validators.required]],
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(255)]],
    is_active: [true, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.recipe();
      this.resetKey();

      this.form.reset({
        consultation_id: current?.consultation_id ?? null,
        name: current?.name ?? '',
        description: current?.description ?? '',
        is_active: current?.is_active ?? true,
      });

      // `is_active` solo cambia con PATCH /deactivate: al editar no se ofrece.
      if (current) {
        this.form.controls.is_active.disable();
      } else {
        this.form.controls.is_active.enable();
      }
    });
  }

  submit(): void {
    const value = this.form.getRawValue();

    if (this.form.invalid || value.consultation_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: RecipeCreate = {
      consultation_id: value.consultation_id,
      name: value.name.trim(),
      description: value.description.trim() || null,
    };

    // `is_active` solo se envía al crear.
    this.saved.emit(this.recipe() ? payload : { ...payload, is_active: value.is_active });
  }
}
