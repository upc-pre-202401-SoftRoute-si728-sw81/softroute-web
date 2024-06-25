import { Component, OnInit, inject, signal } from '@angular/core';
import { ShipmentService } from '../../../shipments/services/shipment.service';
import { Shipment } from '../../../shipments/models/shipment';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { PackageService } from '../../../packages/services/package.service';
import { Package } from '../../../packages/models/package';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TableModule, CommonModule, DividerModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private _shipmentService = inject(ShipmentService);
  private _packageService = inject(PackageService);

  shipments = signal<Shipment[]>([]);
  packages = signal<Package[]>([]);
  numPackages: number = 0;
  delivered: number = 0;
  inTransit: number = 0;
  created: number = 0;
  loading = true;

  ngOnInit(): void {
    this._packageService.getAll().subscribe((data) => {
      this.packages.update((_) => data);
      this.numPackages = this.packages().length;
      this.delivered = this.packages().filter(
        (p) => p.status == 'DELIVERED'
      ).length;

      this.inTransit = this.packages().filter(
        (s) => s.status == 'IN_TRANSIT'
      ).length;

      this.created = this.packages().filter(
        (s) => s.status == 'CREATED'
      ).length;
    });
    this._shipmentService.getAll().subscribe((data) => {
      this.shipments.update((_) => data);

      this.loading = false;
    });
  }
}
