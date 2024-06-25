import { Injectable, inject } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Shipment } from '../models/shipment';
import { Observable, catchError, retry } from 'rxjs';
import { Package } from '../../packages/models/package';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService extends BaseService<Shipment> {
  protected override _http = inject(HttpClient);
  protected override resourceEndpoint = '/shipments';

  getPackages(id: string): Observable<Package[]> {
    return this._http
      .get<Package[]>(`${this.resourcePath()}/${id}/packages`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  startShipment(id: string): Observable<Shipment> {
    return this._http
      .get<Shipment>(`${this.resourcePath()}/${id}/start`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
