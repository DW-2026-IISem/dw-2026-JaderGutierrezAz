import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Shell } from './shell';

describe('Shell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shell],
      providers: [provideRouter([]), MessageService, ConfirmationService],
    }).compileComponents();
  });

  async function crearShell() {
    const fixture = TestBed.createComponent(Shell);
    await fixture.whenStable();
    return { fixture, compilado: fixture.nativeElement as HTMLElement };
  }

  it('should compose header, aside, main, footer and the router outlet', async () => {
    const { compilado } = await crearShell();

    expect(compilado.querySelector('app-header')).toBeTruthy();
    expect(compilado.querySelector('aside app-aside')).toBeTruthy();
    expect(compilado.querySelector('main#contenido router-outlet')).toBeTruthy();
    expect(compilado.querySelector('app-footer')).toBeTruthy();
  });

  it('should open the mobile drawer from the header button', async () => {
    const { fixture, compilado } = await crearShell();

    const boton = compilado.querySelector(
      'app-header button[aria-label="Mostrar u ocultar el menú"]',
    ) as HTMLButtonElement;
    boton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.mobileOpen()).toBe(true);
  });

  it('should host the toast and the confirm dialog once', async () => {
    const { compilado } = await crearShell();

    expect(compilado.querySelectorAll('p-toast').length).toBe(1);
    expect(compilado.querySelectorAll('p-confirmdialog, p-confirm-dialog').length).toBe(1);
  });
});
