import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import {
  VaccineApplication,
  VaccineApplicationCreate,
} from '../../../core/models/vaccine-application.model';
import { SelectOption } from '../../appointments/appointment-form/appointment-form';

/**
 * Formulario de aplicación de vacuna, reutilizado para crear y editar.
 *
 * No llama a la API: recibe la aplicación y las opciones de consulta y de lote, y
 * emite el cuerpo con `saved`. Tu backend responde 500 a un cuerpo incompleto, así
 * que las validaciones de aquí son la única barrera.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-vaccine-application-form',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './vaccine-application-form.html',
  styleUrl: './vaccine-application-form.css',
})
export class VaccineApplicationForm {
  /** Aplicación a editar. `null` deja el formulario en modo creación. */
  readonly application = input<VaccineApplication | null>(null);

  /** Consultas y lotes elegibles (el padre ya filtró los inactivos). */
  readonly consultationOptions = input<SelectOption[]>([]);
  readonly batchOptions = input<SelectOption[]>([]);

  /** Cambia en cada apertura del diálogo: fuerza a reiniciar el formulario. */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<VaccineApplicationCreate>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly stateOptions = [
    { label: 'Activa', value: true },
    { label: 'Inactiva', value: false },
  ];

  readonly form = this.fb.group({
    consultation_id: [null as number | null, [Validators.required]],
    vaccine_batch_id: [null as number | null, [Validators.required]],
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(255)]],
    is_active: [true, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.application();
      this.resetKey();

      this.form.reset({
        consultation_id: current?.consultation_id ?? null,
        vaccine_batch_id: current?.vaccine_batch_id ?? null,
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

    if (this.form.invalid || value.consultation_id === null || value.vaccine_batch_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: VaccineApplicationCreate = {
      consultation_id: value.consultation_id,
      vaccine_batch_id: value.vaccine_batch_id,
      name: value.name.trim(),
      description: value.description.trim() || null,
    };

    // `is_active` solo se envía al crear.
    this.saved.emit(this.application() ? payload : { ...payload, is_active: value.is_active });
  }
}
