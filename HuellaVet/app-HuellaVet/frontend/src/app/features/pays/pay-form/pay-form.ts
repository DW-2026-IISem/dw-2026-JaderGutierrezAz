import { Component, computed, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Appointment } from '../../../core/models/appointment.model';
import { Pay, PayCreate, PayState } from '../../../core/models/pay.model';

/**
 * Formulario de pago, reutilizado para crear y editar.
 *
 * No llama a la API: recibe el pago, las citas elegibles y emite el cuerpo con
 * `saved`. Tu backend responde 500 a un monto negativo o a un estado fuera del
 * enum, así que las validaciones de aquí son la única barrera.
 *
 * `reference_type` no es un campo: hoy solo se soporta `appointment` y viaja fijo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-pay-form',
  imports: [
    ButtonModule,
    DatePickerModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './pay-form.html',
  styleUrl: './pay-form.css',
})
export class PayForm {
  /** Pago a editar. `null` deja el formulario en modo creación. */
  readonly pay = input<Pay | null>(null);

  /** Citas que se pueden elegir (el padre ya filtró las canceladas). */
  readonly appointments = input<Appointment[]>([]);

  /** Cambia en cada apertura del diálogo: fuerza a reiniciar el formulario. */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<PayCreate>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  /** `p-select` necesita una etiqueta plana. */
  readonly appointmentOptions = computed(() =>
    this.appointments().map((appointment) => ({
      id: appointment.id,
      label: this.appointmentLabel(appointment),
    })),
  );

  readonly stateOptions: { label: string; value: PayState }[] = [
    { label: 'Pendiente', value: 'pending' },
    { label: 'Pagado', value: 'paid' },
  ];

  readonly form = this.fb.group({
    reference_id: [null as number | null, [Validators.required]],
    method: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(255)]],
    amount: [
      null as number | null,
      [Validators.required, Validators.min(0), Validators.max(99999999.99)],
    ],
    date: [null as Date | null, [Validators.required]],
    state: ['pending' as PayState, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.pay();
      this.resetKey();

      this.form.reset({
        reference_id: current?.reference_id ?? null,
        method: current?.method ?? '',
        amount: current ? Number(current.amount) : null,
        date: current ? new Date(current.date) : null,
        state: current?.state ?? 'pending',
      });

      // `state` solo cambia con PATCH explícito: al editar no se ofrece.
      if (current) {
        this.form.controls.state.disable();
      } else {
        this.form.controls.state.enable();
      }
    });
  }

  submit(): void {
    const value = this.form.getRawValue();

    if (
      this.form.invalid ||
      value.reference_id === null ||
      value.amount === null ||
      value.date === null
    ) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: PayCreate = {
      reference_type: 'appointment',
      reference_id: value.reference_id,
      method: value.method.trim(),
      amount: Number(value.amount),
      date: value.date.toISOString(),
    };

    // `state` solo se envía al crear.
    this.saved.emit(this.pay() ? payload : { ...payload, state: value.state });
  }

  private appointmentLabel(appointment: Appointment): string {
    const when = new Date(appointment.start_date).toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    return `Cita #${appointment.id} · ${appointment.reason} · ${when}`;
  }
}
