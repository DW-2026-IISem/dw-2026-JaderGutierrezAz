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
import { Appointment } from '../../../core/models/appointment.model';
import { Consultation, ConsultationCreate } from '../../../core/models/consultation.model';
import { Pet } from '../../../core/models/pet.model';
import { Veterinarian } from '../../../core/models/veterinarian.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { AppointmentApi } from '../../appointments/appointment-api';
import { SelectOption } from '../../appointments/appointment-form/appointment-form';
import { PetApi } from '../../pets/pet-api';
import { VeterinarianApi } from '../../veterinarians/veterinarian-api';
import { ConsultationApi } from '../consultation-api';
import { ConsultationForm } from '../consultation-form/consultation-form';

/**
 * Lista de consultas con todas las operaciones del CRUD.
 *
 * Cada consulta pertenece a una cita, y una cita tiene como máximo una consulta:
 * el formulario solo ofrece las citas que todavía no tienen una.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-consultation-list',
  imports: [
    ButtonModule,
    DatePipe,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    ConsultationForm,
  ],
  templateUrl: './consultation-list.html',
  styleUrl: './consultation-list.css',
})
export class ConsultationList {
  private readonly api = inject(ConsultationApi);
  private readonly appointmentsApi = inject(AppointmentApi);
  private readonly petsApi = inject(PetApi);
  private readonly vetsApi = inject(VeterinarianApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Consultation[]>([]);
  readonly appointments = signal<Appointment[]>([]);
  readonly pets = signal<Pet[]>([]);
  readonly veterinarians = signal<Veterinarian[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly dialogVisible = signal(false);
  readonly editing = signal<Consultation | null>(null);
  readonly resetKey = signal(0);

  private readonly petName = computed(() => {
    const byId = new Map(this.pets().map((pet) => [pet.id, pet.name]));
    return (id: number) => byId.get(id) ?? `Mascota #${id}`;
  });

  private readonly vetName = computed(() => {
    const byId = new Map(this.veterinarians().map((vet) => [vet.id, vet.name]));
    return (id: number) => byId.get(id) ?? `Veterinario #${id}`;
  });

  /** `id de cita → { fecha, mascota, veterinario }`: los `Map` se construyen una sola vez. */
  readonly appointmentInfo = computed(() => {
    const petOf = this.petName();
    const vetOf = this.vetName();
    const byId = new Map(this.appointments().map((appt) => [appt.id, appt]));

    return (id: number) => {
      const appt = byId.get(id);
      return appt
        ? { start: appt.start_date, pet: petOf(appt.pet_id), vet: vetOf(appt.veterinarian_id) }
        : { start: null, pet: `Cita #${id}`, vet: '' };
    };
  });

  /** Citas que ya tienen una consulta en la lista. */
  private readonly usedAppointmentIds = computed(
    () => new Set(this.rows().map((consultation) => consultation.appointment_id)),
  );

  /**
   * Citas elegibles: sin consulta y no canceladas, más la de la consulta en edición.
   * Excluir las canceladas es una ayuda de la interfaz; el backend decide.
   */
  readonly appointmentOptions = computed<SelectOption[]>(() => {
    const currentId = this.editing()?.appointment_id;
    const used = this.usedAppointmentIds();
    const info = this.appointmentInfo();

    return this.appointments()
      .filter((appt) => appt.id === currentId || (!used.has(appt.id) && appt.state !== 'cancelled'))
      .map((appt) => {
        const { start, pet, vet } = info(appt.id);
        const when = start
          ? new Date(start).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })
          : '';
        return { id: appt.id, label: `#${appt.id} · ${when} · ${pet} · ${vet}` };
      });
  });

  readonly visibleRows = computed(() => {
    const info = this.appointmentInfo();
    return filterRows(this.rows(), this.filter(), (consultation) => [
      consultation.name,
      consultation.description,
      info(consultation.appointment_id).pet,
      info(consultation.appointment_id).vet,
    ]);
  });

  readonly title = computed(() => (this.editing() ? 'Editar consulta' : 'Nueva consulta'));

  constructor() {
    this.load();
  }

  /** Cuatro peticiones en paralelo: consultas, citas, mascotas y veterinarios. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      consultations: this.api.list(),
      appointments: this.appointmentsApi.list(),
      pets: this.petsApi.list(),
      veterinarians: this.vetsApi.list(),
    }).subscribe({
      next: ({ consultations, appointments, pets, veterinarians }) => {
        this.rows.set(consultations);
        this.appointments.set(appointments);
        this.pets.set(pets);
        this.veterinarians.set(veterinarians);
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

  openEdit(consultation: Consultation): void {
    this.editing.set(consultation);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: ConsultationCreate): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Consulta actualizada' : 'Consulta creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(consultation: Consultation): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar la consulta «${consultation.name}»? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(consultation.id).subscribe({
          next: () => {
            this.notify.warn('Consulta desactivada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. Puede fallar si la consulta ya tiene recetas o vacunas aplicadas. */
  remove(consultation: Consultation): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará la consulta «${consultation.name}» de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(consultation.id).subscribe({
          next: () => {
            this.notify.success('Consulta eliminada');
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
