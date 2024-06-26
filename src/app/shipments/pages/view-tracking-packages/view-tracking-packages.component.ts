import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { Package } from '../../../packages/models/package';
import { ShipmentService } from '../../services/shipment.service';
import { Shipment } from '../../models/shipment';
import { TableModule } from 'primeng/table';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { TrackingSocketsService } from '../../../tracking/websockets/tracking-sockets.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { EMPTY, Observable } from 'rxjs';

@Component({
  selector: 'app-view-tracking-packages',
  standalone: true,
  imports: [TableModule, DateFormatPipe, DecimalPipe, CommonModule],
  templateUrl: './view-tracking-packages.component.html',
  styleUrl: './view-tracking-packages.component.css',
})
export class ViewTrackingPackagesComponent
  implements OnChanges, AfterViewInit, OnDestroy
{
  private _shipmentService = inject(ShipmentService);
  private _trackingSocketService = inject(TrackingSocketsService);
  private _changeDetector = inject(ChangeDetectorRef);

  @Input() shipment?: Shipment;
  wa: Observable<Package[]> = EMPTY;

  packages = signal<Package[]>([]);

  ngOnChanges(changes: SimpleChanges): void {
    this._shipmentService
      .getPackages(this.shipment?.id!)
      .subscribe((data) => this.packages.set(data));
  }

  ngAfterViewInit(): void {
    this._trackingSocketService.init();
    this._trackingSocketService
      .connect()
      .then(() => {
        this._trackingSocketService
          .subscribe(`/topic/shipment/${this.shipment?.code}/packages`)
          .subscribe({
            next: (message) => {
              this.updatePackageData(message);
            },
            error: (error) => {
              console.error('Subscription error: ', error);
            },
          });
      })
      .catch((error) => {
        console.error('Connection error: ', error);
      });
  }

  private updatePackageData(update: {
    code: string;
    breakCondition: boolean;
    humidity: number;
    temperature: number;
  }) {
    const currentPackages = this.packages();
    const updatedPackages = currentPackages.map((pkg) => {
      if (pkg.code === update.code) {
        if (update.code == 'K3L4M') {
          console.log(
            update.breakCondition,
            update.humidity,
            update.temperature
          );
        }
        return {
          ...pkg,
          breakCondition: update.breakCondition,
          humidity: update.humidity,
          temperature: update.temperature,
        };
      }
      return pkg;
    });
    this.packages.set(updatedPackages);
    this._changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this._trackingSocketService.disconnect();
  }
}
