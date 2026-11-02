import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification';

/**
 * Traduce fallos de red y de permisos a un aviso visible.
 *
 * - `0`   → el backend no responde (caído o CORS).
 * - `403` → autenticado, pero sin la concesión (deny by default).
 * - `401` lo gestiona `authInterceptor` (refresh o login).
 *
 * No avisa los 500: tu backend responde 500 a validaciones fallidas y cada pantalla
 * ya muestra el detalle en su propio toast. El error siempre se propaga.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 0) {
          notify.error('Sin conexión', 'No se pudo conectar con el backend.');
        } else if (error.status === 403) {
          notify.error('Acceso denegado', 'Tu rol no tiene permiso para esta operación.');
        }
      }
      return throwError(() => error);
    }),
  );
};
