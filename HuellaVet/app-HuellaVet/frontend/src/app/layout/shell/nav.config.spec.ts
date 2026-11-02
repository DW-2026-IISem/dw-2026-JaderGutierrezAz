import { NAV, NavGroup, visibleNav } from './nav.config';

/** Los 10 permisos reales de `seller` (rol RECEPCIONISTA). */
const SELLER = new Set([
  'GET /api/propietarios',
  'GET /api/propietarios/:id',
  'GET /api/mascotas',
  'GET /api/mascotas/:id',
  'GET /api/veterinarios',
  'GET /api/citas',
  'GET /api/citas/:id',
  'POST /api/citas',
  'PATCH /api/citas/:id/deactivate',
  'GET /api/vacunas',
]);

const etiquetas = (grupo: { items?: { label?: string }[] } | undefined) =>
  (grupo?.items ?? []).map((item) => item.label);

describe('visibleNav', () => {
  it('should show every business entry to a role that has all the permissions', () => {
    const menu = visibleNav(NAV, true, () => true);

    expect(menu.map((g) => g.label)).toEqual(['Operación', 'Referencia']);
    expect(etiquetas(menu[0])).toEqual([
      'Panel',
      'Propietarios',
      'Mascotas',
      'Veterinarios',
      'Citas',
      'Consultas',
      'Vacunas',
      'Lotes de vacunas',
      'Aplicaciones de vacuna',
      'Recetas',
      'Pagos',
    ]);
  });

  it('should show only what the receptionist can read', () => {
    const menu = visibleNav(NAV, true, (permiso) => SELLER.has(permiso));

    expect(etiquetas(menu[0])).toEqual(['Panel', 'Propietarios', 'Mascotas', 'Veterinarios', 'Citas', 'Vacunas']);
  });

  it('should remove a group that has no visible entries', () => {
    const menu = visibleNav(NAV, true, () => false);

    expect(menu.map((g) => g.label)).toEqual(['Referencia']);
  });

  it('should keep the entries that declare no permission', () => {
    const menu = visibleNav(NAV, true, () => false);

    expect(etiquetas(menu[0])).toEqual(['Prototipo']);
  });

  it('should hide authOnly groups when authentication is disabled', () => {
    const nav: NavGroup[] = [
      { label: 'Seguridad', authOnly: true, items: [{ label: 'Usuarios', icon: 'pi pi-user', routerLink: '/admin/usuarios' }] },
    ];

    expect(visibleNav(nav, false, () => true)).toEqual([]);
    expect(visibleNav(nav, true, () => true).length).toBe(1);
  });

  it('should return the groups expanded so the menu does not look empty', () => {
    const menu = visibleNav(NAV, true, () => true);

    expect(menu.every((grupo) => grupo.expanded === true)).toBe(true);
  });

  it('should not repeat a routerLink in the catalog', () => {
    const enlaces = NAV.flatMap((grupo) => grupo.items.map((item) => item.routerLink));

    expect(new Set(enlaces).size).toBe(enlaces.length);
  });
});
