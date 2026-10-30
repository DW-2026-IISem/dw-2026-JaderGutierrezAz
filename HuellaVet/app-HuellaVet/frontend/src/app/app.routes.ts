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
      // La primera pantalla de negocio es la redirección por defecto.
      { path: '', pathMatch: 'full', redirectTo: 'propietarios' },
      {
        path: 'propietarios',
        title: 'Propietarios · HuellaVet',
        loadComponent: () =>
          import('./features/owners/owner-list/owner-list').then((m) => m.OwnerList),
      },
      {
        path: 'mascotas',
        title: 'Mascotas · HuellaVet',
        loadComponent: () =>
          import('./features/pets/pet-list/pet-list').then((m) => m.PetList),
      },
    ],
  },
  { path: '**', redirectTo: 'construir' },
];
