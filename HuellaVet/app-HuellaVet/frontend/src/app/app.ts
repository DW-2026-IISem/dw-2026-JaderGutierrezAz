import { Component } from '@angular/core';
import { Header } from './layout/header/header';
import { Aside } from './layout/aside/aside';
import { Footer } from './layout/footer/footer';

/**
 * Componente principal (`<app-root>`).
 *
 * Compone las cuatro regiones: Header arriba, Aside a la izquierda, el contenido
 * del centro y Footer abajo. El contenido todavía es fijo; en ISS-01B cambia con
 * el menú.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-root',
  imports: [Header, Aside, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  /** Título de la pantalla inicial. */
  protected readonly title = 'Inicio';
}
