import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { Consultation } from '../../../core/models/consultation.model';
import { Recipe, RecipeCreate } from '../../../core/models/recipe.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ConsultationApi } from '../../consultations/consultation-api';
import { RecipeApi } from '../recipe-api';
import { RecipeForm } from '../recipe-form/recipe-form';

/**
 * Lista de recetas con todas las operaciones del CRUD.
 *
 * Cada receta pertenece a una consulta por `consultation_id`; una consulta puede
 * tener varias recetas, así que el formulario ofrece todas las consultas activas.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-recipe-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    RecipeForm,
  ],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.css',
})
export class RecipeList {
  private readonly api = inject(RecipeApi);
  private readonly consultationsApi = inject(ConsultationApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Recipe[]>([]);
  readonly consultations = signal<Consultation[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly dialogVisible = signal(false);
  readonly editing = signal<Recipe | null>(null);
  readonly resetKey = signal(0);

  /** `id → nombre` sin buscar en un arreglo por cada fila. */
  readonly consultationName = computed(() => {
    const byId = new Map(
      this.consultations().map((consultation) => [consultation.id, consultation.name]),
    );
    return (id: number) => byId.get(id) ?? `Consulta #${id}`;
  });

  /** Consultas que el formulario puede ofrecer: activas, más la de la receta en edición. */
  readonly formConsultations = computed(() => {
    const currentId = this.editing()?.consultation_id;
    return this.consultations().filter(
      (consultation) => consultation.is_active || consultation.id === currentId,
    );
  });

  readonly visibleRows = computed(() => {
    const nameOf = this.consultationName();
    return filterRows(this.rows(), this.filter(), (recipe) => [
      recipe.name,
      recipe.description,
      nameOf(recipe.consultation_id),
    ]);
  });

  readonly title = computed(() => (this.editing() ? 'Editar receta' : 'Nueva receta'));

  constructor() {
    this.load();
  }

  /** `GET /api/recetas` y `GET /api/consultas` en paralelo. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      recipes: this.api.list(),
      consultations: this.consultationsApi.list(),
    }).subscribe({
      next: ({ recipes, consultations }) => {
        this.rows.set(recipes);
        this.consultations.set(consultations);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(recipe: Recipe): void {
    this.editing.set(recipe);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: RecipeCreate): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Receta actualizada' : 'Receta creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(recipe: Recipe): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar la receta «${recipe.name}»? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(recipe.id).subscribe({
          next: () => {
            this.notify.warn('Receta desactivada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. Ninguna tabla depende de las recetas. */
  remove(recipe: Recipe): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará la receta «${recipe.name}» de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(recipe.id).subscribe({
          next: () => {
            this.notify.success('Receta eliminada');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo eliminar', toApiMessage(error));
          },
        });
      },
    });
  }
}
