import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Package } from '../models/package';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PackageService extends BaseService<Package> {
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/packages';
  }
}
