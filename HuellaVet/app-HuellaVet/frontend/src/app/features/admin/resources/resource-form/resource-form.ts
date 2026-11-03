import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../../core/models/api.model';
import { HttpMethod } from '../../../../core/models/api.model';
import { Resource, ResourceCreate } from '../../../../core/models/resource.model';

export const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Formulario de recurso (par método + ruta), reutilizado para crear y editar.
 *
 * El backend NO valida el `/` inicial (aceptó `sin-barra`), así que se exige aquí. Para
 * rutas con parámetro se usa `:id`, igual que el catálogo. Cambiar el método o la ruta de
 * un recurso cambia lo que autorizan las concesiones que ya lo usan.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-resource-form',
  imports: [ButtonModule, InputTextModule, MessageModule, ReactiveFormsModule, SelectModule],
  templateUrl: './resource-form.html',
  styleUrl: './resource-form.css',
})
export class ResourceForm {
  readonly resource = input<Resource | null>(null);
  readonly resetKey = input(0);
  readonly saving = input(false);

  readonly saved = output<ResourceCreate>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly methodOptions = HTTP_METHODS.map((method) => ({ label: method, value: method }));

  readonly statusOptions: { label: string; value: Status }[] = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    method: ['GET' as HttpMethod, [Validators.required]],
    path: ['', [Validators.required, Validators.pattern(/^\/\S*$/), Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(255)]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.resource();
      this.resetKey();

      this.form.reset({
        method: current?.method ?? 'GET',
        path: current?.path ?? '',
        description: current?.description ?? '',
        status: current?.status ?? 'active',
      });

      if (current) {
        this.form.controls.status.disable();
      } else {
        this.form.controls.status.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: ResourceCreate = {
      method: value.method,
      path: value.path.trim(),
      description: value.description.trim() || null,
    };

    this.saved.emit(this.resource() ? payload : { ...payload, status: value.status });
  }
}
