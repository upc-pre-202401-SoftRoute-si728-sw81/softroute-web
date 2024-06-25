import { Injectable, inject } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Client } from '../models/client';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends BaseService<Client> {
  protected override _http = inject(HttpClient);
  protected override resourceEndpoint = '/clients';
}
