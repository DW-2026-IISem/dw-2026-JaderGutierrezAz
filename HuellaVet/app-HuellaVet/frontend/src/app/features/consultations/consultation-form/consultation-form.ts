import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Consultation, ConsultationCreate } from '../../../core/models/consultation.model';
import { SelectOption } from '../../appointments/appointment-form/appointment-form';

/**
 * Formulario de consulta, reutilizado para crear y editar.
 *
 * No llama a la API: recibe la consulta y las citas elegibles, y emite el cuerpo con
 * `saved`. Tu backend responde 500 a un cuerpo incompleto, así que las validaciones
 * de aquí son la única barrera.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-consultation-form',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './consultation-form.html',
  styleUrl: './consultation-form.css',
})
export class ConsultationForm {
  /** Consulta a editar. `null` deja el formulario en modo creación. */
  readonly consultation = input<Consultation | null>(null);

  /** Citas elegibles: el padre ya excluyó las que tienen consulta. */
  readonly appointmentOptions = input<SelectOption[]>([]);

  /** Cambia en cada apertura del diálogo: fuerza a reiniciar el formulario. */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<ConsultationCreate>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly stateOptions = [
    { label: 'Activa', value: true },
    { label: 'Inactiva', value: false },
  ];

  readonly form = this.fb.group({
    appointment_id: [null as number | null, [Validators.required]],
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(255)]],
    is_active: [true, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.consultation();
      this.resetKey();

      this.form.reset({
        appointment_id: current?.appointment_id ?? null,
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

    if (this.form.invalid || value.appointment_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: ConsultationCreate = {
      appointment_id: value.appointment_id,
      name: value.name.trim(),
      description: value.description.trim() || null,
    };

    // `is_active` solo se envía al crear.
    this.saved.emit(this.consultation() ? payload : { ...payload, is_active: value.is_active });
  }
}
