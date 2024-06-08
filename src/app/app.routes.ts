import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app.layout.component';
import { TrackingComponent } from './tracking/pages/tracking/tracking.component';
import { LoginComponent } from './security/pages/login/login.component';  // Importa el componente de login

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige la ruta raíz a login
  { path: 'login', component: LoginComponent }, // Define la ruta para el login
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'tracking', component: TrackingComponent },
    ],
  },
];
