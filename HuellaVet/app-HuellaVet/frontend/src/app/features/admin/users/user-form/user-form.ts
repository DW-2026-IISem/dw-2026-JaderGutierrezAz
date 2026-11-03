import { Component, effect, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { Status } from '../../../../core/models/api.model';
import { User, UserCreate, UserUpdate } from '../../../../core/models/user.model';

/** Al crear sale un `UserCreate`; al editar, un `UserUpdate` (sin contraseña ni estado). */
export type UserFormValue = UserCreate | UserUpdate;

/**
 * Formulario de usuario, reutilizado para crear y editar.
 *
 * No llama a la API. Tu backend responde 500 a un cuerpo vacío y acepta contraseñas
 * de cualquier longitud, así que estas validaciones son la única barrera.
 * `password` y `status` solo se ofrecen al crear: el estado se cambia con /deactivate
 * y la contraseña tiene su propia operación (PATCH /:id/password).
 */
@Component({
  host: { class: 'block' },
  selector: 'app-user-form',
  imports: [
    ButtonModule,
    InputTextModule,
    MessageModule,
    PasswordModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  /** Usuario a editar. `null` deja el formulario en modo creación. */
  readonly user = input<User | null>(null);

  /** Cambia en cada apertura del diálogo: fuerza a reiniciar el formulario. */
  readonly resetKey = input(0);

  readonly saving = input(false);

  readonly saved = output<UserFormValue>();
  readonly cancelled = output<void>();

  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions: { label: string; value: Status }[] = [
    { label: 'Activo', value: 'active' },
    { label: 'Inactivo', value: 'inactive' },
  ];

  readonly form = this.fb.group({
    username: [
      '',
      [Validators.required, Validators.pattern(/\S/), Validators.minLength(3), Validators.maxLength(255)],
    ],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    avatar: ['', [Validators.maxLength(255)]],
    status: ['active' as Status, [Validators.required]],
  });

  constructor() {
    effect(() => {
      const current = this.user();
      this.resetKey();

      this.form.reset({
        username: current?.username ?? '',
        email: current?.email ?? '',
        password: '',
        avatar: current?.avatar ?? '',
        status: current?.status ?? 'active',
      });

      // Un control deshabilitado no cuenta para la validez del formulario.
      if (current) {
        this.form.controls.password.disable();
        this.form.controls.status.disable();
      } else {
        this.form.controls.password.enable();
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
    const base: UserUpdate = {
      username: value.username.trim(),
      email: value.email.trim(),
      avatar: value.avatar.trim() || null,
    };

    if (this.user()) {
      this.saved.emit(base);
      return;
    }

    this.saved.emit({ ...base, password: value.password, status: value.status });
  }
}
