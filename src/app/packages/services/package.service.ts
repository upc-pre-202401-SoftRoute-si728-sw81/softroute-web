import { Injectable, inject } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Package } from '../models/package';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PackageService extends BaseService<Package> {
  protected override _http = inject(HttpClient);
  protected override resourceEndpoint = '/packages';
}
