import { Injectable, inject } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Tracking } from '../model/tracking';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TrackingService extends BaseService<Tracking> {
  protected override _http = inject(HttpClient);
  protected override resourceEndpoint = '/tracking';
}
