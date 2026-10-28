import { TestBed } from '@angular/core/testing';
import { StatusTag } from './status-tag';

describe('StatusTag', () => {
  it('should show Activo and success when the record is active', async () => {
    await TestBed.configureTestingModule({ imports: [StatusTag] }).compileComponents();
    const fixture = TestBed.createComponent(StatusTag);
    fixture.componentRef.setInput('active', true);
    await fixture.whenStable();

    expect(fixture.componentInstance.label()).toBe('Activo');
    expect(fixture.componentInstance.severity()).toBe('success');
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Activo');
  });

  it('should react when the input changes to inactive', async () => {
    await TestBed.configureTestingModule({ imports: [StatusTag] }).compileComponents();
    const fixture = TestBed.createComponent(StatusTag);
    fixture.componentRef.setInput('active', true);
    await fixture.whenStable();

    fixture.componentRef.setInput('active', false);
    await fixture.whenStable();

    expect(fixture.componentInstance.label()).toBe('Inactivo');
    expect(fixture.componentInstance.severity()).toBe('danger');
  });
});
