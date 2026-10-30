import { Component, computed, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Owner } from '../../../core/models/owner.model';
import { Pet, PetCreate } from '../../../core/models/pet.model';

/**
 * Formulario de mascota, reutilizado para crear y editar.
 *
 * No llama a la API: recibe la mascota, los propietarios elegibles y emite el
 * cuerpo con `saved`. Tu backend responde 500 a un cuerpo incompleto, así que las
 * validaciones de aquí son la única barrera.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-pet-form',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    ReactiveFormsModule,
    SelectModule,
    TextareaModule,
  ],
  templateUrl: './pet-form.html',
  styleUrl: './pet-form.css',
})
export class PetForm {
  /** Mascota a editar. `null` deja el formulario en modo creación. */
  readonly pet = input<Pet | null>(null);

  /** Propietarios que se pueden elegir (el padre ya filtró los inactivos). */
  readonly owners = input<Owner[]>([]);

  /** Cambia en cada apertura del diálogo: fuerza a reiniciar el formulario. */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<PetCreate>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  /** `p-select` necesita una etiqueta plana: nombre y documento distinguen homónimos. */
  readonly ownerOptions = computed(() =>
    this.owners().map((owner) => ({
      id: owner.id,
      label: `${owner.name} · ${owner.document_number}`,
    })),
  );

  readonly stateOptions = [
    { label: 'Activa', value: true },
    { label: 'Inactiva', value: false },
  ];

  readonly form = this.fb.group({
    owner_id: [null as number | null, [Validators.required]],
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(255)]],
    description: ['', [Validators.maxLength(255)]],
    is_active: [true, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.pet();
      this.resetKey();

      this.form.reset({
        owner_id: current?.owner_id ?? null,
        name: current?.name ?? '',
        description: current?.description ?? '',
        is_active: current?.is_active ?? true,
      });

      // `is_active` solo cambia con PATCH /deactivate: al editar no se ofrece.
      if (current) {
        this.form.controls.is_active.disable();
      } else {
        this.form.controls.is_active.enable();
      }
    });
  }

  submit(): void {
    const value = this.form.getRawValue();

    if (this.form.invalid || value.owner_id === null) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: PetCreate = {
      owner_id: value.owner_id,
      name: value.name.trim(),
      description: value.description.trim() || null,
    };

    // `is_active` solo se envía al crear.
    this.saved.emit(this.pet() ? payload : { ...payload, is_active: value.is_active });
  }
}
