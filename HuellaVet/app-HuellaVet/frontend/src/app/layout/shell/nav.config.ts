import { MenuItem } from 'primeng/api';

export interface NavItem {
  label: string;
  icon: string;
  routerLink: string;
  /** Permiso `MÉTODO /ruta` que habilita la entrada. Sin permiso: siempre visible. */
  permission?: string;
}

export interface NavGroup {
  label: string;
  /** Solo se muestra con `requireAuth` activo (grupo Seguridad, ISS-10). */
  authOnly?: boolean;
  items: NavItem[];
}

/**
 * Catálogo de navegación. El permiso de cada entrada es el mismo que declara su
 * ruta en `app.routes.ts` (`data.permission`): menú y guard no se contradicen.
 */
export const NAV: NavGroup[] = [
  {
    label: 'Operación',
    items: [
      { label: 'Panel', icon: 'pi pi-chart-bar', routerLink: '/dashboard', permission: 'GET /api/citas' },
      { label: 'Propietarios', icon: 'pi pi-users', routerLink: '/propietarios', permission: 'GET /api/propietarios' },
      { label: 'Mascotas', icon: 'pi pi-heart', routerLink: '/mascotas', permission: 'GET /api/mascotas' },
      { label: 'Veterinarios', icon: 'pi pi-id-card', routerLink: '/veterinarios', permission: 'GET /api/veterinarios' },
      { label: 'Citas', icon: 'pi pi-calendar', routerLink: '/citas', permission: 'GET /api/citas' },
      { label: 'Consultas', icon: 'pi pi-file', routerLink: '/consultas', permission: 'GET /api/consultas' },
      { label: 'Vacunas', icon: 'pi pi-shield', routerLink: '/vacunas', permission: 'GET /api/vacunas' },
      { label: 'Lotes de vacunas', icon: 'pi pi-box', routerLink: '/lotes-vacunas', permission: 'GET /api/lotes-vacunas' },
      {
        label: 'Aplicaciones de vacuna',
        icon: 'pi pi-check-circle',
        routerLink: '/aplicaciones-vacunas',
        permission: 'GET /api/aplicaciones-vacunas',
      },
      { label: 'Recetas', icon: 'pi pi-file-edit', routerLink: '/recetas', permission: 'GET /api/recetas' },
      { label: 'Pagos', icon: 'pi pi-wallet', routerLink: '/pagos', permission: 'GET /api/pagos' },
    ],
  },
  {
    label: 'Referencia',
    items: [{ label: 'Prototipo', icon: 'pi pi-desktop', routerLink: '/construir' }],
  },
];

/**
 * Filtra el catálogo según la sesión y lo convierte al formato `MenuItem` de PrimeNG.
 * Un grupo sin entradas visibles desaparece. Los grupos salen desplegados porque
 * PanelMenu los pinta colapsados por defecto y el menú parecería vacío.
 */
export function visibleNav(
  nav: readonly NavGroup[],
  authEnabled: boolean,
  can: (permission: string) => boolean,
): MenuItem[] {
  return nav
    .filter((group) => !group.authOnly || authEnabled)
    .map(
      (group): MenuItem => ({
        label: group.label,
        expanded: true,
        items: group.items
          .filter((item) => !item.permission || can(item.permission))
          .map((item): MenuItem => ({ label: item.label, icon: item.icon, routerLink: item.routerLink })),
      }),
    )
    .filter((group) => (group.items?.length ?? 0) > 0);
}
