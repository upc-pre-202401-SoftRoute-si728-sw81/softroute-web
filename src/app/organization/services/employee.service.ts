import { Injectable, inject } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { Employee } from '../models/employee';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService extends BaseService<Employee> {
  protected override _http = inject(HttpClient);
  protected override resourceEndpoint = '/employees';
}
