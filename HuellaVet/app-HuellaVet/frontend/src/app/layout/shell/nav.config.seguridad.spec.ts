import { NAV, visibleNav } from './nav.config';

const etiquetas = (grupo: { items?: { label?: string }[] } | undefined) =>
  (grupo?.items ?? []).map((item) => item.label);

const grupo = (menu: ReturnType<typeof visibleNav>, nombre: string) =>
  menu.find((g) => g.label === nombre);

describe('grupo Seguridad del menú', () => {
  it('should show the five administration entries to a role that can read them', () => {
    const menu = visibleNav(NAV, true, () => true);

    expect(etiquetas(grupo(menu, 'Seguridad'))).toEqual([
      'Usuarios',
      'Roles',
      'Recursos',
      'Asignaciones',
      'Concesiones',
    ]);
  });

  it('should hide the whole group from a role without administration permissions', () => {
    const recepcion = new Set(['GET /api/propietarios', 'GET /api/citas']);

    const menu = visibleNav(NAV, true, (permiso) => recepcion.has(permiso));

    expect(grupo(menu, 'Seguridad')).toBeUndefined();
  });

  it('should show only the entries whose GET is granted', () => {
    const menu = visibleNav(NAV, true, (permiso) => permiso === 'GET /api/roles');

    expect(etiquetas(grupo(menu, 'Seguridad'))).toEqual(['Roles']);
  });

  it('should hide the group when authentication is disabled', () => {
    const menu = visibleNav(NAV, false, () => true);

    expect(grupo(menu, 'Seguridad')).toBeUndefined();
  });
});
