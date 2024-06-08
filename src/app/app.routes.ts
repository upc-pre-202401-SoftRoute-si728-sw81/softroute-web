import { Routes } from '@angular/router';
import { AppLayoutComponent } from './shared/layout/app.layout.component';
import { TrackingComponent } from './tracking/pages/tracking/tracking.component';
import { PackagesComponent } from './packages/pages/packages/packages.component';
import { SearchTrackingComponent } from './tracking/pages/search-tracking/search-tracking.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'tracking', component: SearchTrackingComponent },
      { path: 'tracking/:trackingNumber', component: TrackingComponent },
      {
        path: 'packages',
        component: PackagesComponent,
      },
    ],
  },
];
