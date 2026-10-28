import { Component } from '@angular/core';

/** Pie de página de la aplicación. Presentación pura: sin estado ni servicios. */
@Component({
  host: { class: 'block' },
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {}
