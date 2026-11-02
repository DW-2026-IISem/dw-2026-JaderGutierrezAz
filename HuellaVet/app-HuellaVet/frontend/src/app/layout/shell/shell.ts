import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DrawerModule } from 'primeng/drawer';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../core/services/auth';
import { NotificationService } from '../../core/services/notification';
import { SessionStore } from '../../core/services/session-store';
import { toApiMessage } from '../../core/utils/api-error';
import { watchMediaQuery } from '../../core/utils/media-query';
import { Aside } from '../aside/aside';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';

/**
 * Layout persistente de la aplicación.
 *
 * El Header, el Aside y el Footer se montan **una sola vez**; solo la región
 * central cambia con `<router-outlet />`. Reutilizar el layout evita remontar el
 * menú (y perder el scroll o el foco) al navegar.
 *
 * Desde ISS-08 el Shell conoce la sesión: le pasa a Header y Aside los datos ya
 * calculados. Ellos siguen siendo presentación pura y avisan con `output()`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-shell',
  imports: [RouterOutlet, Header, Aside, Footer, ConfirmDialogModule, DrawerModule, ToastModule],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  private readonly auth = inject(AuthService);
  private readonly session = inject(SessionStore);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);

  /** `lg` de Tailwind: desde aquí el Aside es fijo y el botón lo alterna. */
  private readonly isDesktop = watchMediaQuery('(min-width: 1024px)');

  /** Escritorio: Aside fijo visible u oculto. */
  readonly sidebarCollapsed = signal(false);

  /** Móvil: Drawer abierto. */
  readonly mobileOpen = signal(false);

  /** Datos de sesión ya calculados para Header y Aside. */
  readonly authEnabled = this.session.authEnabled;
  readonly permissionCount = this.session.permissionCount;
  readonly username = computed(() => this.session.user()?.username ?? '');
  readonly initials = computed(() => this.username().slice(0, 2).toUpperCase() || 'IN');
  readonly roleLabel = computed(() => this.session.roleNames().join(', ') || 'Sin rol');

  /** Menú del avatar: sesión, sincronizar permisos y salir. */
  readonly userItems: MenuItem[] = [
    { label: 'Mi sesión', icon: 'pi pi-user', routerLink: '/perfil' },
    {
      label: 'Actualizar permisos',
      icon: 'pi pi-refresh',
      command: () => this.refreshPermissions(),
    },
    { separator: true },
    { label: 'Cerrar sesión', icon: 'pi pi-sign-out', command: () => this.logout() },
  ];

  /**
   * Menú de esta etapa: todas las entradas de negocio, sin filtrar.
   * El filtrado por permisos llega en ISS-09.
   */
  readonly items: MenuItem[] = [
    { label: 'Panel', icon: 'pi pi-chart-bar', routerLink: '/dashboard' },
    { label: 'Propietarios', icon: 'pi pi-users', routerLink: '/propietarios' },
    { label: 'Mascotas', icon: 'pi pi-heart', routerLink: '/mascotas' },
    { label: 'Veterinarios', icon: 'pi pi-id-card', routerLink: '/veterinarios' },
    { label: 'Citas', icon: 'pi pi-calendar', routerLink: '/citas' },
    { label: 'Consultas', icon: 'pi pi-file', routerLink: '/consultas' },
    { label: 'Vacunas', icon: 'pi pi-shield', routerLink: '/vacunas' },
    { label: 'Lotes de vacunas', icon: 'pi pi-box', routerLink: '/lotes-vacunas' },
    {
      label: 'Aplicaciones de vacuna',
      icon: 'pi pi-check-circle',
      routerLink: '/aplicaciones-vacunas',
    },
    { label: 'Recetas', icon: 'pi pi-file-edit', routerLink: '/recetas' },
    { label: 'Pagos', icon: 'pi pi-wallet', routerLink: '/pagos' },
    { label: 'Prototipo', icon: 'pi pi-desktop', routerLink: '/construir' },
  ];

  /**
   * Un solo botón, dos disposiciones: en escritorio alterna el Aside fijo; por
   * debajo de `lg` abre el Drawer.
   */
  protected onMenuToggle(): void {
    if (this.isDesktop()) {
      this.sidebarCollapsed.update((collapsed) => !collapsed);
      return;
    }
    this.mobileOpen.set(true);
  }

  /** `POST /api/sesion/logout` y limpieza local; siempre termina en el login. */
  protected logout(): void {
    this.mobileOpen.set(false);
    this.auth.logout().subscribe({
      next: () => {
        this.notify.info('Sesión cerrada');
        void this.router.navigate(['/login']);
      },
    });
  }

  /** Vuelve a pedir perfil y permisos al backend. */
  protected refreshPermissions(): void {
    this.auth.me().subscribe({
      next: () => this.notify.success('Sesión sincronizada', 'Perfil y permisos recargados.'),
      error: (error: unknown) =>
        this.notify.error('No se pudo sincronizar', toApiMessage(error)),
    });
  }
}
