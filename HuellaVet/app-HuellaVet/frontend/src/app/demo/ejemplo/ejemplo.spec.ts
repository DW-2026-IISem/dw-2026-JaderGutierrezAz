import { TestBed } from '@angular/core/testing';
import { Ejemplo } from './ejemplo';

describe('Ejemplo', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Ejemplo] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(Ejemplo);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  async function pulsar(fixture: { detectChanges(): void; whenStable(): Promise<unknown> }, el: HTMLElement, etiqueta: string) {
    const boton = [...el.querySelectorAll('button')].find((b) => b.textContent?.trim() === etiqueta);
    expect(boton).toBeTruthy();
    (boton as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should start with price 45000, IVA 53550 and state Activo', async () => {
    const { el } = await crear();
    expect(el.textContent).toContain('Consulta general');
    expect(el.textContent).toContain('45000');
    expect(el.textContent).toContain('53550');
    expect(el.textContent).toContain('Activo');
  });

  it('should add 1000 to the price, recalculate the IVA and go back with -1000', async () => {
    const { fixture, el } = await crear();
    await pulsar(fixture, el, '+1000');
    expect(el.textContent).toContain('46000');
    expect(el.textContent).toContain('54740');
    await pulsar(fixture, el, '-1000');
    expect(el.textContent).toContain('45000');
  });

  it('should show the typed name in the preview', async () => {
    const { fixture, el } = await crear();
    const campo = el.querySelector('#ejemplo-nombre') as HTMLInputElement;
    campo.value = 'Vacunación anual';
    campo.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.textContent).toContain('Vista previa: Vacunación anual');
  });

  it('should toggle the state and restore everything on reset', async () => {
    const { fixture, el } = await crear();
    await pulsar(fixture, el, 'Cambiar estado');
    expect(el.textContent).toContain('Inactivo');
    expect(el.textContent).toContain('borrado lógico');
    await pulsar(fixture, el, 'Reiniciar');
    expect(el.textContent).toContain('Activo');
    expect(el.textContent).toContain('Consulta general');
  });
});
