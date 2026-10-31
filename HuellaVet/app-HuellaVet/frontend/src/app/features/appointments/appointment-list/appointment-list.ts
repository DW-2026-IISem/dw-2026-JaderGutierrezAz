import { DatePipe } from '@angular/common';
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
import { Appointment, AppointmentCreate } from '../../../core/models/appointment.model';
import { Owner } from '../../../core/models/owner.model';
import { Pet } from '../../../core/models/pet.model';
import { Veterinarian } from '../../../core/models/veterinarian.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { OwnerApi } from '../../owners/owner-api';
import { PetApi } from '../../pets/pet-api';
import { VeterinarianApi } from '../../veterinarians/veterinarian-api';
import { AppointmentApi } from '../appointment-api';
import { AppointmentForm, SelectOption } from '../appointment-form/appointment-form';
import { findOverlap } from '../appointment-overlap';
import { stateLabel, stateSeverity } from '../appointment-state';

/**
 * Lista de citas con todas las operaciones del CRUD, más dos acciones de negocio:
 * completar (PATCH con `state`) y cancelar (PATCH /deactivate).
 *
 * Primera pantalla con dos relaciones: mascota y veterinario.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-appointment-list',
  imports: [
    ButtonModule,
    DatePipe,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    TableModule,
    TagModule,
    TooltipModule,
    AppointmentForm,
  ],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.css',
})
export class AppointmentList {
  private readonly api = inject(AppointmentApi);
  private readonly petsApi = inject(PetApi);
  private readonly vetsApi = inject(VeterinarianApi);
  private readonly ownersApi = inject(OwnerApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Appointment[]>([]);
  readonly pets = signal<Pet[]>([]);
  readonly veterinarians = signal<Veterinarian[]>([]);
  readonly owners = signal<Owner[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly dialogVisible = signal(false);
  readonly editing = signal<Appointment | null>(null);
  readonly resetKey = signal(0);

  /** Para usarlas desde la plantilla. */
  readonly stateLabel = stateLabel;
  readonly stateSeverity = stateSeverity;

  /** `id de mascota → { nombre, propietario }`: el `Map` se construye una sola vez. */
  readonly petInfo = computed(() => {
    const ownerById = new Map(this.owners().map((owner) => [owner.id, owner.name]));
    const petById = new Map(
      this.pets().map((pet) => [
        pet.id,
        { name: pet.name, owner: ownerById.get(pet.owner_id) ?? `Propietario #${pet.owner_id}` },
      ]),
    );
    return (id: number) => petById.get(id) ?? { name: `Mascota #${id}`, owner: '' };
  });

  readonly vetName = computed(() => {
    const byId = new Map(this.veterinarians().map((vet) => [vet.id, vet.name]));
    return (id: number) => byId.get(id) ?? `Veterinario #${id}`;
  });

  /** Mascotas activas, más la de la cita en edición aunque esté inactiva. */
  readonly petOptions = computed<SelectOption[]>(() => {
    const currentId = this.editing()?.pet_id;
    const info = this.petInfo();
    return this.pets()
      .filter((pet) => pet.is_active || pet.id === currentId)
      .map((pet) => ({ id: pet.id, label: `${pet.name} · ${info(pet.id).owner}` }));
  });

  readonly vetOptions = computed<SelectOption[]>(() => {
    const currentId = this.editing()?.veterinarian_id;
    return this.veterinarians()
      .filter((vet) => vet.is_active || vet.id === currentId)
      .map((vet) => ({ id: vet.id, label: vet.name }));
  });

  readonly visibleRows = computed(() => {
    const petOf = this.petInfo();
    const vetOf = this.vetName();
    return filterRows(this.rows(), this.filter(), (appt) => [
      petOf(appt.pet_id).name,
      petOf(appt.pet_id).owner,
      vetOf(appt.veterinarian_id),
      appt.reason,
      stateLabel(appt.state),
    ]);
  });

  readonly title = computed(() => (this.editing() ? 'Editar cita' : 'Nueva cita'));

  constructor() {
    this.load();
  }

  /** Cuatro peticiones en paralelo: citas, mascotas, veterinarios y propietarios. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      appointments: this.api.list(),
      pets: this.petsApi.list(),
      veterinarians: this.vetsApi.list(),
      owners: this.ownersApi.list(),
    }).subscribe({
      next: ({ appointments, pets, veterinarians, owners }) => {
        this.rows.set(appointments);
        this.pets.set(pets);
        this.veterinarians.set(veterinarians);
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

  openEdit(appointment: Appointment): void {
    this.editing.set(appointment);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /**
   * El mismo manejador para crear y editar. Antes de enviar comprueba que el
   * veterinario no tenga otra cita en ese horario; el backend vuelve a validar.
   */
  save(payload: AppointmentCreate): void {
    const current = this.editing();

    if (payload.state !== 'cancelled') {
      const conflict = findOverlap(payload, this.rows(), current?.id);
      if (conflict) {
        const desde = new Date(conflict.start_date).toLocaleString('es-CO', {
          dateStyle: 'short',
          timeStyle: 'short',
        });
        this.notify.warn(
          'Horario ocupado',
          `${this.vetName()(conflict.veterinarian_id)} ya tiene la cita #${conflict.id} desde ${desde}.`,
        );
        return;
      }
    }

    this.saving.set(true);
    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Cita actualizada' : 'Cita creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Acción de negocio: `PATCH /:id` con `state: 'completed'`. */
  complete(appointment: Appointment): void {
    this.confirmation.confirm({
      header: 'Completar cita',
      message: `¿Marcar como completada la cita #${appointment.id}?`,
      icon: 'pi pi-check-circle',
      acceptLabel: 'Completar',
      rejectLabel: 'Volver',
      accept: () => {
        this.api.update(appointment.id, { state: 'completed' }).subscribe({
          next: () => {
            this.notify.success('Cita completada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo completar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Cancelar: `PATCH /:id/deactivate`. */
  cancel(appointment: Appointment): void {
    this.confirmation.confirm({
      header: 'Cancelar cita',
      message: `¿Cancelar la cita #${appointment.id}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Cancelar cita',
      rejectLabel: 'Volver',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(appointment.id).subscribe({
          next: () => {
            this.notify.warn('Cita cancelada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo cancelar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. Puede fallar si la cita ya tiene consulta o pagos. */
  remove(appointment: Appointment): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará la cita #${appointment.id} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(appointment.id).subscribe({
          next: () => {
            this.notify.success('Cita eliminada');
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
