import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  {
    path: 'construir',
    loadComponent: () =>
      import('./features/construir/construir').then((m) => m.Construir),
  },
  {
    path: 'login',
    title: 'Iniciar sesión · HuellaVet',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell/shell').then((m) => m.Shell),
    children: [
      // La entrada por defecto es el panel.
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: 'Panel · HuellaVet',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
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
      {
        path: 'veterinarios',
        title: 'Veterinarios · HuellaVet',
        loadComponent: () =>
          import('./features/veterinarians/veterinarian-list/veterinarian-list').then(
            (m) => m.VeterinarianList,
          ),
      },
      {
        path: 'citas',
        title: 'Citas · HuellaVet',
        loadComponent: () =>
          import('./features/appointments/appointment-list/appointment-list').then(
            (m) => m.AppointmentList,
          ),
      },
      {
        path: 'consultas',
        title: 'Consultas · HuellaVet',
        loadComponent: () =>
          import('./features/consultations/consultation-list/consultation-list').then(
            (m) => m.ConsultationList,
          ),
      },
      {
        path: 'vacunas',
        title: 'Vacunas · HuellaVet',
        loadComponent: () =>
          import('./features/vaccines/vaccine-list/vaccine-list').then((m) => m.VaccineList),
      },
      {
        path: 'lotes-vacunas',
        title: 'Lotes de vacunas · HuellaVet',
        loadComponent: () =>
          import('./features/vaccine-batches/vaccine-batch-list/vaccine-batch-list').then(
            (m) => m.VaccineBatchList,
          ),
      },
      {
        path: 'aplicaciones-vacunas',
        title: 'Aplicaciones de vacuna · HuellaVet',
        loadComponent: () =>
          import(
            './features/vaccine-applications/vaccine-application-list/vaccine-application-list'
          ).then((m) => m.VaccineApplicationList),
      },
      {
        path: 'recetas',
        title: 'Recetas · HuellaVet',
        loadComponent: () =>
          import('./features/recipes/recipe-list/recipe-list').then((m) => m.RecipeList),
      },
      {
        path: 'pagos',
        title: 'Pagos · HuellaVet',
        loadComponent: () =>
          import('./features/pays/pay-list/pay-list').then((m) => m.PayList),
      },
      // Sesión: todo usuario autenticado debe poder verla (sin permissionGuard).
      {
        path: 'perfil',
        title: 'Mi sesión · HuellaVet',
        loadComponent: () =>
          import('./features/auth/profile/profile').then((m) => m.Profile),
      },
      {
        path: 'forbidden',
        title: 'Acceso denegado · HuellaVet',
        loadComponent: () =>
          import('./features/auth/forbidden/forbidden').then((m) => m.Forbidden),
      },
    ],
  },
  { path: '**', redirectTo: 'construir' },
];
