import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../services/session-store';

/**
 * Pantallas que solo existen con sesión (perfil y administración).
 * Con `requireAuth` en `false` (modo laboratorio) redirige al panel.
 */
export const authOnlyGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  if (session.authEnabled) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
