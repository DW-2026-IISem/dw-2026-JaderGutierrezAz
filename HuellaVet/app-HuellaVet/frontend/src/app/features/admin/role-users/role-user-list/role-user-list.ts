import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { Role } from '../../../../core/models/role.model';
import { RoleUser } from '../../../../core/models/role-user.model';
import { User } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { RoleApi } from '../../roles/role-api';
import { UserApi } from '../../users/user-api';
import { RoleUserApi } from '../role-user-api';

/**
 * Asignaciones usuario ↔ rol.
 *
 * No hay DELETE: retirar un rol es una baja lógica. Volver a asignarlo reutiliza la fila
 * (el backend hace create-or-reactivate). Quitarle a un administrador su único rol
 * dejaría sin acceso a esta pantalla, por eso la confirmación lo advierte.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-role-user-list',
  imports: [
    ButtonModule,
    DatePipe,
    DialogModule,
    EmptyState,
    FormsModule,
    HasPermission,
    MessageModule,
    PageHeader,
    SelectModule,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './role-user-list.html',
  styleUrl: './role-user-list.css',
})
export class RoleUserList {
  private readonly api = inject(RoleUserApi);
  private readonly usersApi = inject(UserApi);
  private readonly rolesApi = inject(RoleApi);
  private readonly session = inject(SessionStore);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<RoleUser[]>([]);
  readonly users = signal<User[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly userFilter = signal<number | null>(null);
  readonly roleFilter = signal<number | null>(null);

  readonly dialogVisible = signal(false);
  readonly selectedUser = signal<number | null>(null);
  readonly selectedRole = signal<number | null>(null);

  readonly userOptions = computed(() =>
    this.users()
      .filter((user) => user.status === 'active')
      .map((user) => ({ id: user.id, label: `${user.username} · ${user.email}` })),
  );

  readonly roleOptions = computed(() =>
    this.roles()
      .filter((role) => role.status === 'active')
      .map((role) => ({ id: role.id, label: role.name })),
  );

  readonly visibleRows = computed(() => {
    const user = this.userFilter();
    const role = this.roleFilter();
    return this.rows().filter(
      (row) => (!user || row.user_id === user) && (!role || row.role_id === role),
    );
  });

  readonly canSave = computed(() => this.selectedUser() !== null && this.selectedRole() !== null);

  constructor() {
    this.load();
  }

  userName(row: RoleUser): string {
    return row.user?.username ?? `Usuario #${row.user_id}`;
  }

  roleName(row: RoleUser): string {
    return row.role?.name ?? `Rol #${row.role_id}`;
  }

  /** ¿La asignación es del usuario de la sesión? */
  isOwn(row: RoleUser): boolean {
    return this.session.user()?.id === row.user_id;
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      assignments: this.api.list(),
      users: this.usersApi.list(),
      roles: this.rolesApi.list(),
    }).subscribe({
      next: ({ assignments, users, roles }) => {
        this.rows.set(assignments);
        this.users.set(users);
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openAssign(): void {
    this.selectedUser.set(null);
    this.selectedRole.set(null);
    this.dialogVisible.set(true);
  }

  assign(): void {
    const userId = this.selectedUser();
    const roleId = this.selectedRole();
    if (userId === null || roleId === null) {
      return;
    }

    this.saving.set(true);
    this.api.create({ user_id: userId, role_id: roleId }).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(
          'Rol asignado',
          'La persona ve el cambio al actualizar sus permisos o al iniciar sesión de nuevo.',
        );
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo asignar', toApiMessage(error));
      },
    });
  }

  /** Retirar el rol: `PATCH /:id/deactivate`. */
  retire(row: RoleUser): void {
    const aviso = this.isOwn(row)
      ? ' Es tu propia asignación: podrías perder el acceso a la administración.'
      : '';

    this.confirmation.confirm({
      header: 'Retirar rol',
      message: `¿Retirar el rol «${this.roleName(row)}» a «${this.userName(row)}»?${aviso}`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Retirar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Rol retirado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo retirar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Volver a dar un rol retirado: `PATCH /:id/reactivate`. */
  restore(row: RoleUser): void {
    this.api.reactivate(row.id).subscribe({
      next: () => {
        this.notify.success('Rol reactivado');
        this.load();
      },
      error: (error: unknown) => {
        this.notify.error('No se pudo reactivar', toApiMessage(error));
      },
    });
  }
}
