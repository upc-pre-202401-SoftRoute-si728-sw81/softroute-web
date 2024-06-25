import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app.layout.component';
import { PackagesComponent } from './packages/pages/packages/packages.component';
import { ShipmentsComponent } from './shipments/pages/shipments/shipments.component';
import { ViewShipmentComponent } from './shipments/pages/view-shipment/view-shipment.component';
import { ClientsComponent } from './organization/pages/clients/clients.component';
import { EmployeesComponent } from './organization/pages/employees/employees.component';
import { ViewTrackingComponent } from './tracking/pages/view-tracking/view-tracking.component';
import { authGuard } from './security/guards/auth.guard';
import { LoginComponent } from './security/pages/login/login.component';
import { DashboardComponent } from './dashboard/pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: 'app',
    component: AppLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'shipments',
        component: ShipmentsComponent,
      },
      {
        path: 'shipments/:id',
        component: ViewShipmentComponent,
      },
      {
        path: 'shipments/:id/tracking/:trackingId',
        component: ViewTrackingComponent,
      },
      {
        path: 'packages',
        component: PackagesComponent,
      },
      {
        path: 'clients',
        component: ClientsComponent,
      },
      {
        path: 'employees',
        component: EmployeesComponent,
      },
    ],
    canActivate: [authGuard],
  },
  {
    path: 'auth/login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
