import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Customer } from '../models/customer';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends BaseService<Customer> {
  constructor(http: HttpClient) {
    super(http);
    this.resourceEndpoint = '/organization/clients';
  }
}
