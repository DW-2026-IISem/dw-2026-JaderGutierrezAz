import { TestBed } from '@angular/core/testing';
import { Resource, ResourceCreate } from '../../../../core/models/resource.model';
import { ResourceForm } from './resource-form';

const RECURSO: Resource = {
  id: 64,
  method: 'GET',
  path: '/api/pagos',
  description: 'Listar pago',
  status: 'active',
};

describe('ResourceForm', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ResourceForm] }).compileComponents();
  });

  async function crear() {
    const fixture = TestBed.createComponent(ResourceForm);
    await fixture.whenStable();
    return { fixture, componente: fixture.componentInstance };
  }

  it('should start empty with GET as the method and invalid', async () => {
    const { componente } = await crear();

    expect(componente.form.controls.method.value).toBe('GET');
    expect(componente.form.controls.path.value).toBe('');
    expect(componente.form.invalid).toBe(true);
  });

  it('should require the path to start with a slash and to have no spaces', async () => {
    const { componente } = await crear();

    componente.form.patchValue({ path: 'sin-barra' });
    expect(componente.form.controls.path.invalid).toBe(true);

    componente.form.patchValue({ path: '/api/con espacio' });
    expect(componente.form.controls.path.invalid).toBe(true);

    componente.form.patchValue({ path: '/api/pagos/:id' });
    expect(componente.form.controls.path.valid).toBe(true);
  });

  it('should emit the trimmed body with status when creating', async () => {
    const { componente } = await crear();
    let cuerpo: ResourceCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    componente.form.patchValue({ method: 'POST', path: ' /api/pagos ', description: '' });
    componente.submit();

    expect(cuerpo).toEqual({ method: 'POST', path: '/api/pagos', description: null, status: 'active' });
  });

  it('should load the resource in edit mode and leave status out of the body', async () => {
    const { fixture, componente } = await crear();
    let cuerpo: ResourceCreate | undefined;
    componente.saved.subscribe((valor) => (cuerpo = valor));

    fixture.componentRef.setInput('resource', RECURSO);
    await fixture.whenStable();

    expect(componente.form.controls.status.disabled).toBe(true);

    componente.submit();

    expect(cuerpo).toEqual({ method: 'GET', path: '/api/pagos', description: 'Listar pago' });
    expect('status' in (cuerpo as object)).toBe(false);
  });

  it('should reset the form when resetKey changes', async () => {
    const { fixture, componente } = await crear();

    componente.form.patchValue({ path: '/api/anterior' });
    fixture.componentRef.setInput('resetKey', 1);
    await fixture.whenStable();

    expect(componente.form.controls.path.value).toBe('');
  });
});
