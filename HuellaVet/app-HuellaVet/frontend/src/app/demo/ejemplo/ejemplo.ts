import { Component, computed, effect, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';

export interface Servicio {
  nombre: string;
  precio: number;
  activo: boolean;
}

/** Componente de aprendizaje: un objeto en un signal, derivados y un efecto. */
@Component({
  host: { class: 'block' },
  selector: 'app-ejemplo',
  imports: [ButtonModule, CardModule, InputTextModule, MessageModule, TagModule],
  templateUrl: './ejemplo.html',
  styleUrl: './ejemplo.css',
})
export class Ejemplo {
  // ESTADO: el signal guarda un objeto completo.
  protected readonly servicio = signal<Servicio>(servicioInicial());

  // DERIVADOS: se calculan desde `servicio()`, nunca se asignan.
  protected readonly precioFinal = computed(() =>
    Math.round(this.servicio().precio * 1.19),
  );
  protected readonly estadoTexto = computed(() =>
    this.servicio().activo ? 'Activo' : 'Inactivo',
  );

  // EFECTO: se ejecuta al crear y en cada cambio del objeto.
  private readonly registro = effect(() => {
    const { nombre, precio, activo } = this.servicio();
    console.log(`[ejemplo] ${nombre} · precio ${precio} · ${activo ? 'activo' : 'inactivo'}`);
  });

  protected cambiarNombre(event: Event): void {
    const nombre = (event.target as HTMLInputElement).value;
    this.servicio.update((actual) => ({ ...actual, nombre }));
  }

  protected variarPrecio(delta: number): void {
    this.servicio.update((actual) => ({
      ...actual,
      precio: Math.max(0, actual.precio + delta),
    }));
  }

  protected alternarEstado(): void {
    this.servicio.update((actual) => ({ ...actual, activo: !actual.activo }));
  }

  protected reiniciar(): void {
    this.servicio.set(servicioInicial());
  }
}

/** Evita compartir el mismo objeto entre el estado inicial y el reinicio. */
function servicioInicial(): Servicio {
  return { nombre: 'Consulta general', precio: 45000, activo: true };
}
