import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Resource, ResourceCreate } from '../../../../core/models/resource.model';
import { NotificationService } from '../../../../core/services/notification';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { methodSeverity } from '../../../../core/utils/http-method';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { ResourceApi } from '../resource-api';
import { HTTP_METHODS, ResourceForm } from '../resource-form/resource-form';

/**
 * Catálogo de recursos HTTP (pares método + ruta).
 *
 * Crear un recurso no crea una pantalla ni protege una ruta: solo registra una capacidad
 * que luego se concede a un rol. Para el día a día se prefiere la baja lógica a borrar.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-resource-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    FormsModule,
    HasPermission,
    InputTextModule,
    MessageModule,
    PageHeader,
    ResourceForm,
    SelectModule,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './resource-list.html',
  styleUrl: './resource-list.css',
})
export class ResourceList {
  private readonly api = inject(ResourceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly methodSeverity = methodSeverity;

  readonly methodOptions = [
    { label: 'Todos los métodos', value: '' },
    ...HTTP_METHODS.map((method) => ({ label: method, value: method as string })),
  ];

  readonly rows = signal<Resource[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  readonly methodFilter = signal('');

  readonly dialogVisible = signal(false);
  readonly editing = signal<Resource | null>(null);
  readonly resetKey = signal(0);

  /** Cuántos recursos hay de cada método. */
  readonly countsByMethod = computed(() =>
    HTTP_METHODS.map((method) => ({
      method,
      count: this.rows().filter((row) => row.method === method).length,
    })),
  );

  readonly visibleRows = computed(() => {
    const method = this.methodFilter();
    const filtered = filterRows(this.rows(), this.filter(), (row) => [
      row.path,
      row.description,
      row.method,
    ]);
    return method ? filtered.filter((row) => row.method === method) : filtered;
  });

  readonly title = computed(() => (this.editing() ? 'Editar recurso' : 'Nuevo recurso'));

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (resources) => {
        this.rows.set(resources);
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

  openEdit(resource: Resource): void {
    this.editing.set(resource);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  save(payload: ResourceCreate): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Recurso actualizado' : 'Recurso creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  deactivate(resource: Resource): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Dar de baja «${resource.method} ${resource.path}»? Las concesiones que lo usan dejarán de autorizarlo y esta pantalla no permite reactivarlo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Dar de baja',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(resource.id).subscribe({
          next: () => {
            this.notify.warn('Recurso dado de baja');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo dar de baja', toApiMessage(error));
          },
        });
      },
    });
  }

  remove(resource: Resource): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará «${resource.method} ${resource.path}». Rompe las filas históricas de concesiones que lo usen y puede ser rechazado por la base de datos. Prefiere la baja lógica.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(resource.id).subscribe({
          next: () => {
            this.notify.success('Recurso eliminado');
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
