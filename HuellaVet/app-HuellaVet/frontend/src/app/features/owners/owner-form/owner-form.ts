import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { Owner, OwnerCreate } from '../../../core/models/owner.model';

/**
 * Formulario de propietario, reutilizado para crear y editar.
 *
 * No llama a la API: recibe `owner` (o `null` para crear) y emite el cuerpo con
 * `saved`. El padre decide entre `POST` y `PATCH` y controla el diálogo, así que
 * este componente sirve igual dentro de un Dialog que en una página.
 *
 * Tu backend responde 500 (no 400) a un cuerpo incompleto: estas validaciones son
 * la única barrera, por eso los campos obligatorios no se pueden saltar.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-owner-form',
  imports: [ButtonModule, InputTextModule, MessageModule, ReactiveFormsModule, SelectModule],
  templateUrl: './owner-form.html',
  styleUrl: './owner-form.css',
})
export class OwnerForm {
  /** Propietario a editar. `null` deja el formulario en modo creación. */
  readonly owner = input<Owner | null>(null);

  /**
   * Cambia cada vez que el padre abre el diálogo. Sin esto, reabrir «Nuevo
   * propietario» tras cancelar conservaría lo escrito: `owner` sigue siendo `null`,
   * así que el `effect()` no volvería a correr.
   */
  readonly resetKey = input(0);

  /** Petición en curso: deshabilita el botón y muestra su spinner. */
  readonly saving = input(false);

  readonly saved = output<OwnerCreate>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  /** El backend acepta cualquier texto; esta es la lista habitual en Colombia. */
  readonly documentTypes = ['CC', 'CE', 'TI', 'NIT', 'PP'];

  readonly stateOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  readonly form = this.fb.group({
    document_type: ['CC', [Validators.required]],
    document_number: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(30)]],
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(120)]],
    phone: ['', [Validators.maxLength(30)]],
    email: ['', [Validators.email, Validators.maxLength(120)]],
    is_active: [true, [Validators.required]],
  });

  constructor() {
    // `effect()` reacciona a `owner()` y a `resetKey()`: sin `ngOnChanges`.
    effect(() => {
      const current = this.owner();
      this.resetKey();

      this.form.reset({
        document_type: current?.document_type ?? 'CC',
        document_number: current?.document_number ?? '',
        name: current?.name ?? '',
        phone: current?.phone ?? '',
        email: current?.email ?? '',
        is_active: current?.is_active ?? true,
      });

      // El backend solo cambia `is_active` con PATCH /deactivate. Si el campo
      // siguiera habilitado, el formulario prometería algo que se ignora.
      if (current) {
        this.form.controls.is_active.disable();
      } else {
        this.form.controls.is_active.enable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: OwnerCreate = {
      document_type: value.document_type,
      document_number: value.document_number.trim(),
      name: value.name.trim(),
      phone: value.phone.trim() || null,
      email: value.email.trim() || null,
    };

    // `is_active` solo se envía al crear: en edición lo gobierna /deactivate.
    this.saved.emit(this.owner() ? payload : { ...payload, is_active: value.is_active });
  }
}
