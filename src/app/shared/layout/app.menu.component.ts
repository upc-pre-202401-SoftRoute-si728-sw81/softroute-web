import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      {
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-th-large',
            routerLink: ['/app/dashboard'],
          },

          {
            label: 'Packages',
            icon: 'pi pi-box',
            routerLink: ['/app/packages'],
          },
          {
            label: 'Shipments',
            icon: 'pi pi-truck',
            routerLink: ['/app/shipments'],
          },
        ],
      },
      
    ];
  }
}
