import { Component, OnInit, inject, signal } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [TableModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit {
  private _employeeSerivce = inject(EmployeeService);

  employees = signal<Employee[]>([]);

  ngOnInit(): void {
    this._employeeSerivce
      .getAll()
      .subscribe((data) => this.employees.set(data));
  }
}
