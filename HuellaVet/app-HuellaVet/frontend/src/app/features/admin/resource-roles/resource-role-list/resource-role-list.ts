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
import { forkJoin } from 'rxjs';
import { Resource } from '../../../../core/models/resource.model';
import { ResourceRole } from '../../../../core/models/resource-role.model';
import { Role } from '../../../../core/models/role.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { methodSeverity } from '../../../../core/utils/http-method';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { ResourceApi } from '../../resources/resource-api';
import { RoleApi } from '../../roles/role-api';
import { ResourceRoleApi } from '../resource-role-api';

/**
 * Concesiones rol ↔ recurso: cada fila ES un permiso.
 *
 * No hay DELETE: revocar es una baja lógica y volver a conceder es reactivar (o repetir
 * el alta). Conceder o revocar aquí cambia lo que el backend autoriza en la siguiente
 * petición; el menú de cada persona se actualiza con «Actualizar permisos».
 */
@Component({
  host: { class: 'block' },
  selector: 'app-resource-role-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    FormsModule,
    HasPermission,
    InputTextModule,
    MessageModule,
    PageHeader,
    SelectModule,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './resource-role-list.html',
  styleUrl: './resource-role-list.css',
})
export class ResourceRoleList {
  private readonly api = inject(ResourceRoleApi);
  private readonly rolesApi = inject(RoleApi);
  private readonly resourcesApi = inject(ResourceApi);
  private readonly session = inject(SessionStore);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly methodSeverity = methodSeverity;

  readonly rows = signal<ResourceRole[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly resources = signal<Resource[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly filter = signal('');
  readonly roleFilter = signal<number | null>(null);

  readonly dialogVisible = signal(false);
  readonly selectedRole = signal<number | null>(null);
  readonly selectedResource = signal<number | null>(null);

  readonly roleOptions = computed(() =>
    this.roles()
      .filter((role) => role.status === 'active')
      .map((role) => ({ id: role.id, label: role.name })),
  );

  /** Solo los recursos activos se pueden conceder. */
  readonly resourceOptions = computed(() =>
    this.resources().filter((resource) => resource.status === 'active'),
  );

  readonly visibleRows = computed(() => {
    const role = this.roleFilter();
    const byRole = role ? this.rows().filter((row) => row.role_id === role) : this.rows();
    return filterRows(byRole, this.filter(), (row) => [
      row.role?.name,
      row.resource?.method,
      row.resource?.path,
      row.resource?.description,
    ]);
  });

  readonly canSave = computed(
    () => this.selectedRole() !== null && this.selectedResource() !== null,
  );

  constructor() {
    this.load();
  }

  /** ¿Revocar este permiso afecta a un rol que la sesión está usando? */
  affectsSession(row: ResourceRole): boolean {
    return !!row.role && this.session.hasRole(row.role.name);
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      grants: this.api.list(),
      roles: this.rolesApi.list(),
      resources: this.resourcesApi.list(),
    }).subscribe({
      next: ({ grants, roles, resources }) => {
        this.rows.set(grants);
        this.roles.set(roles);
        this.resources.set(resources);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openGrant(): void {
    this.selectedRole.set(null);
    this.selectedResource.set(null);
    this.dialogVisible.set(true);
  }

  grant(): void {
    const roleId = this.selectedRole();
    const resourceId = this.selectedResource();
    if (roleId === null || resourceId === null) {
      return;
    }

    this.saving.set(true);
    this.api.create({ role_id: roleId, resource_id: resourceId }).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(
          'Permiso concedido',
          'El backend ya lo aplica; el menú de cada persona cambia al actualizar sus permisos.',
        );
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo conceder', toApiMessage(error));
      },
    });
  }

  /** Revocar: `PATCH /:id/deactivate`. */
  revoke(row: ResourceRole): void {
    const permiso = row.resource ? `${row.resource.method} ${row.resource.path}` : `#${row.resource_id}`;
    const aviso = this.affectsSession(row)
      ? ' Tu sesión usa este rol: podrías perder el acceso a esta pantalla.'
      : '';

    this.confirmation.confirm({
      header: 'Revocar permiso',
      message: `¿Revocar «${permiso}» al rol «${row.role?.name ?? row.role_id}»?${aviso}`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Revocar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Permiso revocado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo revocar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Volver a conceder un permiso revocado: `PATCH /:id/reactivate`. */
  restore(row: ResourceRole): void {
    this.api.reactivate(row.id).subscribe({
      next: () => {
        this.notify.success('Permiso reactivado');
        this.load();
      },
      error: (error: unknown) => {
        this.notify.error('No se pudo reactivar', toApiMessage(error));
      },
    });
  }
}
