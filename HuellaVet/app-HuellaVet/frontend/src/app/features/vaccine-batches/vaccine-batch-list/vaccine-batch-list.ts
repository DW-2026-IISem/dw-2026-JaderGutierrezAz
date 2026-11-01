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
import { Vaccine } from '../../../core/models/vaccine.model';
import { VaccineBatch, VaccineBatchCreate } from '../../../core/models/vaccine-batch.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { VaccineApi } from '../../vaccines/vaccine-api';
import { VaccineBatchApi } from '../vaccine-batch-api';
import { VaccineBatchForm } from '../vaccine-batch-form/vaccine-batch-form';

/**
 * Lista de lotes de vacunas con todas las operaciones del CRUD.
 *
 * Cada lote pertenece a una vacuna por `vaccine_id`: la tabla muestra su nombre y
 * el formulario ofrece las vacunas activas.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-vaccine-batch-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    VaccineBatchForm,
  ],
  templateUrl: './vaccine-batch-list.html',
  styleUrl: './vaccine-batch-list.css',
})
export class VaccineBatchList {
  private readonly api = inject(VaccineBatchApi);
  private readonly vaccinesApi = inject(VaccineApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<VaccineBatch[]>([]);
  readonly vaccines = signal<Vaccine[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly dialogVisible = signal(false);
  readonly editing = signal<VaccineBatch | null>(null);
  readonly resetKey = signal(0);

  /** `id → nombre` sin buscar en un arreglo por cada fila. */
  readonly vaccineName = computed(() => {
    const byId = new Map(this.vaccines().map((vaccine) => [vaccine.id, vaccine.name]));
    return (id: number) => byId.get(id) ?? `Vacuna #${id}`;
  });

  /** Vacunas que el formulario puede ofrecer: activas, más la del lote en edición. */
  readonly formVaccines = computed(() => {
    const currentId = this.editing()?.vaccine_id;
    return this.vaccines().filter((vaccine) => vaccine.is_active || vaccine.id === currentId);
  });

  readonly visibleRows = computed(() => {
    const nameOf = this.vaccineName();
    return filterRows(this.rows(), this.filter(), (batch) => [
      batch.name,
      batch.description,
      nameOf(batch.vaccine_id),
    ]);
  });

  readonly title = computed(() => (this.editing() ? 'Editar lote' : 'Nuevo lote'));

  constructor() {
    this.load();
  }

  /** `GET /api/lotes-vacunas` y `GET /api/vacunas` en paralelo. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      batches: this.api.list(),
      vaccines: this.vaccinesApi.list(),
    }).subscribe({
      next: ({ batches, vaccines }) => {
        this.rows.set(batches);
        this.vaccines.set(vaccines);
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

  openEdit(batch: VaccineBatch): void {
    this.editing.set(batch);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: VaccineBatchCreate): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Lote actualizado' : 'Lote creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(batch: VaccineBatch): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar el lote «${batch.name}»? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(batch.id).subscribe({
          next: () => {
            this.notify.warn('Lote desactivado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. Puede fallar si el lote ya se aplicó en alguna consulta. */
  remove(batch: VaccineBatch): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará el lote «${batch.name}» de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(batch.id).subscribe({
          next: () => {
            this.notify.success('Lote eliminado');
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
