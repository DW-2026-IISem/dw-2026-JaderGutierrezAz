import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Forbidden } from './forbidden';

describe('Forbidden', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Forbidden],
      providers: [provideRouter([{ path: 'forbidden', component: Forbidden }])],
    }).compileComponents();
  });

  it('should show the permission that was missing', async () => {
    const harness = await RouterTestingHarness.create();

    const pantalla = await harness.navigateByUrl('/forbidden?permission=GET%20%2Fapi%2Fpagos', Forbidden);

    expect(pantalla.permission).toBe('GET /api/pagos');
    expect(harness.routeNativeElement?.textContent).toContain('GET /api/pagos');
  });

  it('should not show the permission block when none was reported', async () => {
    const harness = await RouterTestingHarness.create();

    const pantalla = await harness.navigateByUrl('/forbidden', Forbidden);

    expect(pantalla.permission).toBeNull();
    expect(harness.routeNativeElement?.textContent).not.toContain('Permiso requerido');
  });
});
