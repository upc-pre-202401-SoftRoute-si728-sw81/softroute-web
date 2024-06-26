import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { ShipmentService } from '../../services/shipment.service';
import { Shipment } from '../../models/shipment';
import { ActivatedRoute, Router } from '@angular/router';
import { Package } from '../../../packages/models/package';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-shipment',
  standalone: true,
  templateUrl: './view-shipment.component.html',
  styleUrl: './view-shipment.component.css',
  imports: [
    TableModule,
    PanelModule,
    ButtonModule,
    DateFormatPipe,
    RippleModule,
    RelativeTimePipe,
    CommonModule,
  ],
})
export class ViewShipmentComponent implements OnChanges {
  @Input() shipment?: Shipment;

  private _shipmentService = inject(ShipmentService);

  packages?: Package[];

  ngOnChanges(changes: SimpleChanges): void {
    const id = this.shipment?.id;
    this._shipmentService
      .getPackages(id!)
      .subscribe((data) => (this.packages = data));
  }

  onInitShipment(): void {
    const id = this.shipment?.id;
    this._shipmentService.startShipment(id!).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        console.log('wa');
      },
    });
  }
}
