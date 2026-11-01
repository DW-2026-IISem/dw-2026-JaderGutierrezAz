import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { Appointment } from '../../../core/models/appointment.model';
import { Pay, PayCreate, PayState } from '../../../core/models/pay.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { AppointmentApi } from '../../appointments/appointment-api';
import { PayApi } from '../pay-api';
import { PayForm } from '../pay-form/pay-form';

const STATE_LABELS: Record<PayState, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  cancelled: 'Cancelado',
};

const STATE_SEVERITIES: Record<PayState, 'warn' | 'success' | 'danger'> = {
  pending: 'warn',
  paid: 'success',
  cancelled: 'danger',
};

/**
 * Lista de pagos con todas las operaciones del CRUD.
 *
 * Cada pago referencia una cita por `reference_id`: la tabla muestra la cita y el
 * formulario ofrece las citas no canceladas. Marcar como pagado es un PATCH
 * explícito con `state`; cancelar es `/deactivate`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-pay-list',
  imports: [
    ButtonModule,
    CurrencyPipe,
    DatePipe,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    PayForm,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './pay-list.html',
  styleUrl: './pay-list.css',
})
export class PayList {
  private readonly api = inject(PayApi);
  private readonly appointmentsApi = inject(AppointmentApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Pay[]>([]);
  readonly appointments = signal<Appointment[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly dialogVisible = signal(false);
  readonly editing = signal<Pay | null>(null);
  readonly resetKey = signal(0);

  /** `id → etiqueta` sin buscar en un arreglo por cada fila. */
  readonly appointmentLabel = computed(() => {
    const byId = new Map(
      this.appointments().map((appointment) => [
        appointment.id,
        `Cita #${appointment.id} · ${appointment.reason}`,
      ]),
    );
    return (id: number) => byId.get(id) ?? `Cita #${id}`;
  });

  /** Citas que el formulario puede ofrecer: no canceladas, más la del pago en edición. */
  readonly formAppointments = computed(() => {
    const currentId = this.editing()?.reference_id;
    return this.appointments().filter(
      (appointment) => appointment.state !== 'cancelled' || appointment.id === currentId,
    );
  });

  readonly visibleRows = computed(() => {
    const labelOf = this.appointmentLabel();
    return filterRows(this.rows(), this.filter(), (pay) => [
      pay.method,
      String(pay.amount),
      labelOf(pay.reference_id),
      STATE_LABELS[pay.state],
    ]);
  });

  readonly title = computed(() => (this.editing() ? 'Editar pago' : 'Nuevo pago'));

  constructor() {
    this.load();
  }

  stateLabel(state: PayState): string {
    return STATE_LABELS[state];
  }

  stateSeverity(state: PayState): 'warn' | 'success' | 'danger' {
    return STATE_SEVERITIES[state];
  }

  /** `GET /api/pagos` y `GET /api/citas` en paralelo. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      pays: this.api.list(),
      appointments: this.appointmentsApi.list(),
    }).subscribe({
      next: ({ pays, appointments }) => {
        this.rows.set(pays);
        this.appointments.set(appointments);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(pay: Pay): void {
    this.editing.set(pay);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: PayCreate): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Pago actualizado' : 'Pago creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Marcar como pagado: `PATCH /:id` con `{ state: 'paid' }`. */
  markPaid(pay: Pay): void {
    this.confirmation.confirm({
      header: 'Marcar como pagado',
      message: `¿Marcar el pago #${pay.id} como pagado? Esta acción queda registrada en la historia.`,
      icon: 'pi pi-check-circle',
      acceptLabel: 'Marcar pagado',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.api.update(pay.id, { state: 'paid' }).subscribe({
          next: () => {
            this.notify.success('Pago marcado como pagado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo marcar como pagado', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Cancelación (baja lógica): `PATCH /:id/deactivate`. El pago deja de listarse. */
  deactivate(pay: Pay): void {
    this.confirmation.confirm({
      header: 'Cancelar pago',
      message: `¿Cancelar el pago #${pay.id}? Su estado pasará a cancelado y dejará de listarse.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Cancelar pago',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(pay.id).subscribe({
          next: () => {
            this.notify.warn('Pago cancelado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo cancelar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. */
  remove(pay: Pay): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará el pago #${pay.id} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(pay.id).subscribe({
          next: () => {
            this.notify.success('Pago eliminado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo eliminar', toApiMessage(error));
          },
        });
      },
    });
  }
}
