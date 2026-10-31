import { Component, effect, inject, input, output } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import {
  Appointment,
  AppointmentCreate,
  AppointmentState,
} from '../../../core/models/appointment.model';
import { APPOINTMENT_STATES } from '../appointment-state';

/** Opción de un `p-select`: el valor enviado es el `id`, la etiqueta es solo para leer. */
export interface SelectOption {
  id: number;
  label: string;
}

/** La cita debe terminar después de empezar. */
const endAfterStart: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const start = group.get('start_date')?.value as Date | null;
  const end = group.get('end_date')?.value as Date | null;
  return start && end && end.getTime() <= start.getTime() ? { endBeforeStart: true } : null;
};

/**
 * Formulario de cita, reutilizado para crear y editar.
 *
 * No llama a la API: recibe la cita y las opciones de los selectores, y emite el
 * cuerpo con `saved`. A diferencia del resto de entidades, `state` SÍ viaja al
 * editar (el PATCH de citas lo acepta): completar una cita es una acción de negocio.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-appointment-form',
  imports: [
    ButtonModule,
    DatePickerModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export class AppointmentForm {
  /** Cita a editar. `null` deja el formulario en modo creación. */
  readonly appointment = input<Appointment | null>(null);

  /** Mascotas y veterinarios elegibles (el padre ya filtró los inactivos). */
  readonly petOptions = input<SelectOption[]>([]);
  readonly vetOptions = input<SelectOption[]>([]);

  /** Cambia en cada apertura del diálogo: fuerza a reiniciar el formulario. */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<AppointmentCreate>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly stateOptions = APPOINTMENT_STATES;

  readonly form = this.fb.group(
    {
      pet_id: [null as number | null, [Validators.required]],
      veterinarian_id: [null as number | null, [Validators.required]],
      start_date: [null as Date | null, [Validators.required]],
      end_date: [null as Date | null, [Validators.required]],
      reason: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(255)]],
      state: ['scheduled' as AppointmentState, [Validators.required]],
    },
    { validators: endAfterStart },
  );

  constructor() {
    effect(() => {
      const current = this.appointment();
      this.resetKey();

      this.form.reset({
        pet_id: current?.pet_id ?? null,
        veterinarian_id: current?.veterinarian_id ?? null,
        start_date: current ? new Date(current.start_date) : null,
        end_date: current ? new Date(current.end_date) : null,
        reason: current?.reason ?? '',
        state: current?.state ?? 'scheduled',
      });
    });
  }

  submit(): void {
    const value = this.form.getRawValue();

    if (
      this.form.invalid ||
      value.pet_id === null ||
      value.veterinarian_id === null ||
      value.start_date === null ||
      value.end_date === null
    ) {
      this.form.markAllAsTouched();
      return;
    }

    this.saved.emit({
      pet_id: value.pet_id,
      veterinarian_id: value.veterinarian_id,
      // ISO-8601 (UTC): es el instante exacto; la tabla lo muestra en hora local.
      start_date: value.start_date.toISOString(),
      end_date: value.end_date.toISOString(),
      reason: value.reason.trim(),
      state: value.state,
    });
  }
}
