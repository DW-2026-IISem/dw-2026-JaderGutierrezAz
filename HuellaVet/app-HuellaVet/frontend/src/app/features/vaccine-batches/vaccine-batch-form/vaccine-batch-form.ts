import { Component, computed, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Vaccine } from '../../../core/models/vaccine.model';
import { VaccineBatch, VaccineBatchCreate } from '../../../core/models/vaccine-batch.model';

/**
 * Formulario de lote de vacuna, reutilizado para crear y editar.
 *
 * No llama a la API: recibe el lote, las vacunas elegibles y emite el cuerpo con
 * `saved`. Tu backend responde 500 a un cuerpo incompleto, así que las validaciones
 * de aquí son la única barrera.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-vaccine-batch-form',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './vaccine-batch-form.html',
  styleUrl: './vaccine-batch-form.css',
})
export class VaccineBatchForm {
  /** Lote a editar. `null` deja el formulario en modo creación. */
  readonly batch = input<VaccineBatch | null>(null);

  /** Vacunas que se pueden elegir (el padre ya filtró las inactivas). */
  readonly vaccines = input<Vaccine[]>([]);

  /** Cambia en cada apertura del diálogo: fuerza a reiniciar el formulario. */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<VaccineBatchCreate>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  /** `p-select` necesita una etiqueta plana. */
  readonly vaccineOptions = computed(() =>
    this.vaccines().map((vaccine) => ({ id: vaccine.id, label: vaccine.name })),
  );

  readonly stateOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    vaccine_id: [null as number | null, [Validators.required]],
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(255)]],
    is_active: [true, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.batch();
      this.resetKey();

      this.form.reset({
        vaccine_id: current?.vaccine_id ?? null,
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

    if (this.form.invalid || value.vaccine_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: VaccineBatchCreate = {
      vaccine_id: value.vaccine_id,
      name: value.name.trim(),
      description: value.description.trim() || null,
    };

    // `is_active` solo se envía al crear.
    this.saved.emit(this.batch() ? payload : { ...payload, is_active: value.is_active });
  }
}
