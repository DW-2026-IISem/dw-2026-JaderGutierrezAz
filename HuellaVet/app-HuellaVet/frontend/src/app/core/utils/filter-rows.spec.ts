import { filterRows } from './filter-rows';

interface Fila {
  id: number;
  nombre: string;
  correo: string | null;
}

const FILAS: Fila[] = [
  { id: 1, nombre: 'Ana Pérez', correo: 'ana@correo.com' },
  { id: 2, nombre: 'Luis Gómez', correo: null },
  { id: 3, nombre: 'María Ana', correo: 'maria@correo.com' },
];

const pick = (fila: Fila) => [fila.nombre, fila.correo];

describe('filterRows', () => {
  it('should return a copy of all the rows when there is no term', () => {
    const resultado = filterRows(FILAS, '   ', pick);

    expect(resultado).toEqual(FILAS);
    expect(resultado).not.toBe(FILAS);
  });

  it('should ignore case and surrounding spaces', () => {
    expect(filterRows(FILAS, '  ANA ', pick).map((f) => f.id)).toEqual([1, 3]);
  });

  it('should match any of the picked fields', () => {
    expect(filterRows(FILAS, 'correo.com', pick).map((f) => f.id)).toEqual([1, 3]);
  });

  it('should tolerate null values', () => {
    expect(filterRows(FILAS, 'luis', pick).map((f) => f.id)).toEqual([2]);
  });

  it('should return an empty array when nothing matches', () => {
    expect(filterRows(FILAS, 'zzz', pick)).toEqual([]);
  });
});
