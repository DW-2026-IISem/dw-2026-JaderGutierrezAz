import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { toApiMessage } from '../../../core/utils/api-error';
import { AuthService } from '../../../core/services/auth';

/**
 * Pantalla de inicio de sesión (fuera del Shell: sin menú ni cabecera).
 *
 * Llama a `AuthService.login`, que guarda los tokens y carga perfil y permisos
 * antes de emitir. Solo entonces se navega.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-login',
  imports: [
    ButtonModule,
    CardModule,
    InputTextModule,
    MessageModule,
    PasswordModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    identifier: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    const { identifier, password } = this.form.getRawValue();
    // `identifier` acepta username o email.
    this.auth.login({ identifier: identifier.trim(), password }).subscribe({
      next: () => {
        const requested = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/dashboard';
        // Solo rutas internas: evita open redirects.
        const returnUrl =
          requested.startsWith('/') && !requested.startsWith('//') && !requested.startsWith('/login')
            ? requested
            : '/dashboard';
        void this.router.navigateByUrl(returnUrl);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.error.set(toApiMessage(error));
      },
    });
  }
}
