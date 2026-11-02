import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HttpMethod } from '../../../core/models/api.model';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification';
import { SessionStore } from '../../../core/services/session-store';
import { toApiMessage } from '../../../core/utils/api-error';
import { PageHeader } from '../../../shared/ui/page-header/page-header';

/** Usuario, roles y permisos efectivos de la sesión actual. */
@Component({
  host: { class: 'block' },
  selector: 'app-profile',
  imports: [ButtonModule, CardModule, PageHeader, TableModule, TagModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly session = inject(SessionStore);

  readonly user = this.session.user;
  readonly roleNames = this.session.roleNames;
  readonly permissions = this.session.permissions;
  readonly permissionCount = this.session.permissionCount;

  readonly refreshing = signal(false);

  methodSeverity(method: HttpMethod): 'info' | 'success' | 'warn' | 'danger' | 'secondary' {
    switch (method) {
      case 'GET':
        return 'info';
      case 'POST':
        return 'success';
      case 'PUT':
      case 'PATCH':
        return 'warn';
      case 'DELETE':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  /** Vuelve a pedir perfil y permisos al backend. */
  refresh(): void {
    this.refreshing.set(true);
    this.auth.me().subscribe({
      next: () => {
        this.refreshing.set(false);
        this.notify.success('Sesión sincronizada', 'Perfil y permisos recargados.');
      },
      error: (error: unknown) => {
        this.refreshing.set(false);
        this.notify.error('No se pudo sincronizar', toApiMessage(error));
      },
    });
  }

  /** Cierra la sesión: `POST /api/sesion/logout` y limpieza local. */
  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.notify.info('Sesión cerrada');
        void this.router.navigate(['/login']);
      },
    });
  }
}
