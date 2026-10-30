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
import { Owner } from '../../../core/models/owner.model';
import { Pet, PetCreate } from '../../../core/models/pet.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { OwnerApi } from '../../owners/owner-api';
import { PetApi } from '../pet-api';
import { PetForm } from '../pet-form/pet-form';

/**
 * Lista de mascotas con todas las operaciones del CRUD.
 *
 * Primera relación del curso: cada mascota apunta a un propietario por `owner_id`.
 * La tabla muestra su nombre y el formulario ofrece los propietarios activos.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-pet-list',
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
    PetForm,
  ],
  templateUrl: './pet-list.html',
  styleUrl: './pet-list.css',
})
export class PetList {
  private readonly api = inject(PetApi);
  private readonly ownersApi = inject(OwnerApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Pet[]>([]);
  readonly owners = signal<Owner[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly dialogVisible = signal(false);
  readonly editing = signal<Pet | null>(null);
  readonly resetKey = signal(0);

  /**
   * `id → nombre` sin buscar en un arreglo por cada fila: el `Map` se construye
   * una vez, solo cuando cambian los propietarios. Devuelve una función a propósito.
   */
  readonly ownerName = computed(() => {
    const byId = new Map(this.owners().map((owner) => [owner.id, owner.name]));
    return (id: number) => byId.get(id) ?? `Propietario #${id}`;
  });

  /** Propietarios que el formulario puede ofrecer: activos, más el de la mascota en edición. */
  readonly formOwners = computed(() => {
    const currentOwner = this.editing()?.owner_id;
    return this.owners().filter((owner) => owner.is_active || owner.id === currentOwner);
  });

  readonly visibleRows = computed(() => {
    const nameOf = this.ownerName();
    return filterRows(this.rows(), this.filter(), (pet) => [
      pet.name,
      pet.description,
      nameOf(pet.owner_id),
    ]);
  });

  readonly title = computed(() => (this.editing() ? 'Editar mascota' : 'Nueva mascota'));

  constructor() {
    this.load();
  }

  /** `GET /api/mascotas` y `GET /api/propietarios` en paralelo. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      pets: this.api.list(),
      owners: this.ownersApi.list(),
    }).subscribe({
      next: ({ pets, owners }) => {
        this.rows.set(pets);
        this.owners.set(owners);
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

  openEdit(pet: Pet): void {
    this.editing.set(pet);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: PetCreate): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Mascota actualizada' : 'Mascota creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(pet: Pet): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar a ${pet.name}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(pet.id).subscribe({
          next: () => {
            this.notify.warn('Mascota desactivada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. Puede fallar si la mascota ya tiene citas. */
  remove(pet: Pet): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará a ${pet.name} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(pet.id).subscribe({
          next: () => {
            this.notify.success('Mascota eliminada');
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
