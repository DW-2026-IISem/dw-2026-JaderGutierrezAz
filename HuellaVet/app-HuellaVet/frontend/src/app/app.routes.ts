import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'construir',
    loadComponent: () =>
      import('./features/construir/construir').then((m) => m.Construir),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      // Sin pantallas de negocio todavía: ISS-03 pondrá aquí la primera.
      { path: '', pathMatch: 'full', redirectTo: '/construir' },
    ],
  },
  { path: '**', redirectTo: 'construir' },
];
