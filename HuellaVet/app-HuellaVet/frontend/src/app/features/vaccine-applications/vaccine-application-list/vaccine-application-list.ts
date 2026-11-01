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
import { Consultation } from '../../../core/models/consultation.model';
import { Vaccine } from '../../../core/models/vaccine.model';
import {
  VaccineApplication,
  VaccineApplicationCreate,
} from '../../../core/models/vaccine-application.model';
import { VaccineBatch } from '../../../core/models/vaccine-batch.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { SelectOption } from '../../appointments/appointment-form/appointment-form';
import { ConsultationApi } from '../../consultations/consultation-api';
import { VaccineBatchApi } from '../../vaccine-batches/vaccine-batch-api';
import { VaccineApi } from '../../vaccines/vaccine-api';
import { VaccineApplicationApi } from '../vaccine-application-api';
import { VaccineApplicationForm } from '../vaccine-application-form/vaccine-application-form';

/**
 * Lista de aplicaciones de vacuna con todas las operaciones del CRUD.
 *
 * Cada aplicación une una consulta con un lote, y el lote pertenece a una vacuna:
 * la tabla muestra los tres nombres y los formularios ofrecen solo registros activos.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-vaccine-application-list',
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
    VaccineApplicationForm,
  ],
  templateUrl: './vaccine-application-list.html',
  styleUrl: './vaccine-application-list.css',
})
export class VaccineApplicationList {
  private readonly api = inject(VaccineApplicationApi);
  private readonly consultationsApi = inject(ConsultationApi);
  private readonly batchesApi = inject(VaccineBatchApi);
  private readonly vaccinesApi = inject(VaccineApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<VaccineApplication[]>([]);
  readonly consultations = signal<Consultation[]>([]);
  readonly batches = signal<VaccineBatch[]>([]);
  readonly vaccines = signal<Vaccine[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly dialogVisible = signal(false);
  readonly editing = signal<VaccineApplication | null>(null);
  readonly resetKey = signal(0);

  /** `id de consulta → nombre`: el `Map` se construye una sola vez. */
  readonly consultationName = computed(() => {
    const byId = new Map(this.consultations().map((consultation) => [consultation.id, consultation.name]));
    return (id: number) => byId.get(id) ?? `Consulta #${id}`;
  });

  /** `id de lote → { lote, vacuna }`. */
  readonly batchInfo = computed(() => {
    const vaccineById = new Map(this.vaccines().map((vaccine) => [vaccine.id, vaccine.name]));
    const batchById = new Map(
      this.batches().map((batch) => [
        batch.id,
        {
          batch: batch.name,
          vaccine: vaccineById.get(batch.vaccine_id) ?? `Vacuna #${batch.vaccine_id}`,
        },
      ]),
    );
    return (id: number) => batchById.get(id) ?? { batch: `Lote #${id}`, vaccine: '' };
  });

  /** Consultas activas, más la de la aplicación en edición aunque esté inactiva. */
  readonly consultationOptions = computed<SelectOption[]>(() => {
    const currentId = this.editing()?.consultation_id;
    return this.consultations()
      .filter((consultation) => consultation.is_active || consultation.id === currentId)
      .map((consultation) => ({
        id: consultation.id,
        label: `#${consultation.id} · ${consultation.name}`,
      }));
  });

  /** Lotes activos, más el de la aplicación en edición aunque esté inactivo. */
  readonly batchOptions = computed<SelectOption[]>(() => {
    const currentId = this.editing()?.vaccine_batch_id;
    const info = this.batchInfo();
    return this.batches()
      .filter((batch) => batch.is_active || batch.id === currentId)
      .map((batch) => ({ id: batch.id, label: `${batch.name} · ${info(batch.id).vaccine}` }));
  });

  readonly visibleRows = computed(() => {
    const consultationOf = this.consultationName();
    const batchOf = this.batchInfo();
    return filterRows(this.rows(), this.filter(), (application) => [
      application.name,
      application.description,
      consultationOf(application.consultation_id),
      batchOf(application.vaccine_batch_id).batch,
      batchOf(application.vaccine_batch_id).vaccine,
    ]);
  });

  readonly title = computed(() => (this.editing() ? 'Editar aplicación' : 'Nueva aplicación'));

  constructor() {
    this.load();
  }

  /** Cuatro peticiones en paralelo: aplicaciones, consultas, lotes y vacunas. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      applications: this.api.list(),
      consultations: this.consultationsApi.list(),
      batches: this.batchesApi.list(),
      vaccines: this.vaccinesApi.list(),
    }).subscribe({
      next: ({ applications, consultations, batches, vaccines }) => {
        this.rows.set(applications);
        this.consultations.set(consultations);
        this.batches.set(batches);
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

  openEdit(application: VaccineApplication): void {
    this.editing.set(application);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: VaccineApplicationCreate): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Aplicación actualizada' : 'Aplicación creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(application: VaccineApplication): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar la aplicación «${application.name}»? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(application.id).subscribe({
          next: () => {
            this.notify.warn('Aplicación desactivada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. Ninguna tabla depende de las aplicaciones. */
  remove(application: VaccineApplication): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará la aplicación «${application.name}» de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(application.id).subscribe({
          next: () => {
            this.notify.success('Aplicación eliminada');
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
