import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { EffectivePermission } from '../../../../core/models/auth.model';
import { User, UserCreate, UserUpdate } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { methodSeverity } from '../../../../core/utils/http-method';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { UserApi } from '../user-api';
import { UserForm, UserFormValue } from '../user-form/user-form';

/**
 * Administración de usuarios.
 *
 * El backend solo lista los activos y, una vez inactivo, ni siquiera devuelve el
 * detalle: la baja lógica de un usuario no se puede deshacer desde esta pantalla.
 * Por eso nadie puede darse de baja ni borrarse a sí mismo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-user-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    HasPermission,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    UserForm,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  private readonly api = inject(UserApi);
  private readonly session = inject(SessionStore);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly methodSeverity = methodSeverity;

  readonly rows = signal<User[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly dialogVisible = signal(false);
  readonly editing = signal<User | null>(null);
  readonly resetKey = signal(0);

  /** «Ver permisos»: la misma consulta que usa `authorize`, la forma más rápida de diagnosticar un 403. */
  readonly accessVisible = signal(false);
  readonly accessLoading = signal(false);
  readonly accessUser = signal<User | null>(null);
  readonly access = signal<EffectivePermission[]>([]);

  readonly accessRoles = computed(() => [
    ...new Set(this.access().map((permission) => permission.role_name)),
  ]);

  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (user) => [user.username, user.email, user.avatar]),
  );

  readonly title = computed(() => (this.editing() ? 'Editar usuario' : 'Nuevo usuario'));

  constructor() {
    this.load();
  }

  /** ¿Es el usuario de la sesión? Darse de baja o borrarse bloquearía la administración. */
  isSelf(user: User): boolean {
    return this.session.user()?.id === user.id;
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (users) => {
        this.rows.set(users);
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

  openEdit(user: User): void {
    this.editing.set(user);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: UserFormValue): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current
      ? this.api.update(current.id, payload as UserUpdate)
      : this.api.create(payload as UserCreate);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Usuario actualizado' : 'Usuario creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  showPermissions(user: User): void {
    this.accessUser.set(user);
    this.access.set([]);
    this.accessLoading.set(true);
    this.accessVisible.set(true);

    this.api.permissions(user.id).subscribe({
      next: (permissions) => {
        this.access.set(permissions);
        this.accessLoading.set(false);
      },
      error: (error: unknown) => {
        this.accessLoading.set(false);
        this.accessVisible.set(false);
        this.notify.error('No se pudieron consultar los permisos', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(user: User): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Dar de baja a «${user.username}»? Dejará de poder iniciar sesión y esta pantalla no permite reactivarlo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Dar de baja',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(user.id).subscribe({
          next: () => {
            this.notify.warn('Usuario dado de baja');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo dar de baja', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. Puede fallar si el usuario ya tiene asignaciones de rol. */
  remove(user: User): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará a «${user.username}» de la base de datos. Puede fallar si ya tiene roles asignados, aunque estén retirados. No se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(user.id).subscribe({
          next: () => {
            this.notify.success('Usuario eliminado');
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
