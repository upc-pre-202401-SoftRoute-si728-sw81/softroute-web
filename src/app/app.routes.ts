import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app.layout.component';
import { TrackingComponent } from './tracking/pages/tracking/tracking.component';
import { PackagesComponent } from './packages/pages/packages/packages.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'tracking', component: TrackingComponent },
      {
        path: 'packages',
        component: PackagesComponent,
      },
    ],
  },
];
