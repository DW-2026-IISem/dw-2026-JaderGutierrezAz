import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Vaccine, VaccineCreate } from '../../../core/models/vaccine.model';

/**
 * Formulario de vacuna, reutilizado para crear y editar.
 *
 * No llama a la API: recibe la vacuna (o `null` para crear) y emite el cuerpo con
 * `saved`. Tu backend responde 500 a un cuerpo incompleto, así que estas
 * validaciones son la única barrera.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-vaccine-form',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './vaccine-form.html',
  styleUrl: './vaccine-form.css',
})
export class VaccineForm {
  /** Vacuna a editar. `null` deja el formulario en modo creación. */
  readonly vaccine = input<Vaccine | null>(null);

  /** Cambia en cada apertura del diálogo: fuerza a reiniciar el formulario. */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<VaccineCreate>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly stateOptions = [
    { label: 'Activa', value: true },
    { label: 'Inactiva', value: false },
  ];

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(255)]],
    is_active: [true, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.vaccine();
      this.resetKey();

      this.form.reset({
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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: VaccineCreate = {
      name: value.name.trim(),
      description: value.description.trim() || null,
    };

    // `is_active` solo se envía al crear.
    this.saved.emit(this.vaccine() ? payload : { ...payload, is_active: value.is_active });
  }
}
