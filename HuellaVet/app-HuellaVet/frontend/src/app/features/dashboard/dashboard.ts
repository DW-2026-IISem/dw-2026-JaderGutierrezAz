import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { forkJoin, of } from 'rxjs';
import { toNumber } from '../../core/models/api.model';
import { Appointment } from '../../core/models/appointment.model';
import { Pay } from '../../core/models/pay.model';
import { Pet } from '../../core/models/pet.model';
import { SessionStore } from '../../core/services/session-store';
import { toApiMessage } from '../../core/utils/api-error';
import { HasPermission } from '../../shared/directives/has-permission';
import { EmptyState } from '../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { AppointmentApi } from '../appointments/appointment-api';
import { OwnerApi } from '../owners/owner-api';
import { PayApi } from '../pays/pay-api';
import { PetApi } from '../pets/pet-api';

const APPOINTMENT_STATES: Record<string, string> = {
  scheduled: 'Programada',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

/**
 * Panel de la clínica.
 *
 * No hay un endpoint de dashboard: todo se deriva de cuatro listados que ya existen.
 * La API devuelve los datos; `computed` calcula los indicadores.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-dashboard',
  imports: [
    CardModule,
    CurrencyPipe,
    DatePipe,
    EmptyState,
    HasPermission,
    MessageModule,
    PageHeader,
    RouterLink,
    SkeletonModule,
    TableModule,
    TagModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly ownersApi = inject(OwnerApi);
  private readonly petsApi = inject(PetApi);
  private readonly appointmentsApi = inject(AppointmentApi);
  private readonly paysApi = inject(PayApi);
  private readonly session = inject(SessionStore);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly ownerCount = signal(0);
  readonly pets = signal<Pet[]>([]);
  readonly appointments = signal<Appointment[]>([]);
  readonly pays = signal<Pay[]>([]);

  /** Ingresos: solo los pagos en estado `paid`. `amount` llega como string. */
  readonly revenue = computed(() =>
    this.pays()
      .filter((pay) => pay.state === 'paid')
      .reduce((sum, pay) => sum + toNumber(pay.amount), 0),
  );

  /** Pagos que todavía requieren acción. */
  readonly pendingPays = computed(() => this.pays().filter((pay) => pay.state === 'pending'));

  /** Las cinco citas más recientes por fecha de inicio. */
  readonly latestAppointments = computed(() =>
    [...this.appointments()]
      .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
      .slice(0, 5),
  );

  readonly petName = computed(() => {
    const byId = new Map(this.pets().map((pet) => [pet.id, pet.name]));
    return (id: number) => byId.get(id) ?? `Mascota #${id}`;
  });

  readonly appointmentLabel = computed(() => {
    const byId = new Map(
      this.appointments().map((appointment) => [
        appointment.id,
        `Cita #${appointment.id} · ${appointment.reason}`,
      ]),
    );
    return (id: number) => byId.get(id) ?? `Cita #${id}`;
  });

  constructor() {
    this.load();
  }

  appointmentStateLabel(state: string): string {
    return APPOINTMENT_STATES[state] ?? state;
  }

  appointmentStateSeverity(state: string): 'info' | 'success' | 'danger' | 'secondary' {
    switch (state) {
      case 'scheduled':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  /** Cuatro `GET` en paralelo: el panel se pinta una sola vez. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    // Solo se pide lo que el rol puede leer: un 403 en una sola petición haría
    // fallar el forkJoin completo. Lo que no se pide queda vacío y su tarjeta se oculta.
    const can = (permission: string) => this.session.canPermission(permission);

    forkJoin({
      owners: can('GET /api/propietarios') ? this.ownersApi.list() : of([]),
      pets: can('GET /api/mascotas') ? this.petsApi.list() : of([]),
      appointments: can('GET /api/citas') ? this.appointmentsApi.list() : of([]),
      pays: can('GET /api/pagos') ? this.paysApi.list() : of([]),
    }).subscribe({
      next: ({ owners, pets, appointments, pays }) => {
        this.ownerCount.set(owners.length);
        this.pets.set(pets);
        this.appointments.set(appointments);
        this.pays.set(pays);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }
}
