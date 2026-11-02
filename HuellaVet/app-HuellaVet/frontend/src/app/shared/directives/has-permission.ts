import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';
import { SessionStore } from '../../core/services/session-store';

/**
 * Muestra su contenido solo si la sesión tiene el permiso indicado.
 *
 *   <ng-container *appHasPermission="'POST /api/pagos'">…</ng-container>
 *
 * Es UX, no seguridad: Express vuelve a validar cada petición. La vista embebida
 * se crea o se destruye, así que el contenido sin permiso no queda en el DOM.
 * El `effect` lee `permissions()` para reaccionar a «Actualizar permisos».
 */
@Directive({ selector: '[appHasPermission]' })
export class HasPermission {
  /** Permiso en el formato `MÉTODO /ruta`, igual que el catálogo del backend. */
  readonly appHasPermission = input.required<string>();

  private readonly session = inject(SessionStore);
  private readonly template = inject<TemplateRef<unknown>>(TemplateRef);
  private readonly container = inject(ViewContainerRef);
  private visible = false;

  constructor() {
    effect(() => {
      // Dependencia explícita: sin esta lectura el efecto no se reevaluaría.
      this.session.permissions();
      const allowed = this.session.canPermission(this.appHasPermission());

      if (allowed && !this.visible) {
        this.container.createEmbeddedView(this.template);
        this.visible = true;
      } else if (!allowed && this.visible) {
        this.container.clear();
        this.visible = false;
      }
    });
  }
}
