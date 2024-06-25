import { Component, OnInit, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ShipmentService } from '../../services/shipment.service';
import { Shipment } from '../../models/shipment';
import { TableModule } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DataView, DataViewModule } from 'primeng/dataview';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { GoogleMapsModule } from '@angular/google-maps';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { ViewShipmentComponent } from '../view-shipment/view-shipment.component';
import { ViewTrackingShipmentComponent } from '../view-tracking-shipment/view-tracking-shipment.component';
import { TabViewModule } from 'primeng/tabview';
import { ViewTrackingPackagesComponent } from '../view-tracking-packages/view-tracking-packages.component';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Employee } from '../../../organization/models/employee';
import { EmployeeService } from '../../../organization/services/employee.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { Package } from '../../../packages/models/package';
import { PackageService } from '../../../packages/services/package.service';
import { ShipmentReq } from '../../models/shipment-req';
import { EMPTY, Observable, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shipments',
  standalone: true,
  providers: [MessageService],
  templateUrl: './shipments.component.html',
  styleUrl: './shipments.component.css',
  imports: [
    ButtonModule,
    TableModule,
    DataViewModule,
    ToastModule,
    InputTextModule,
    GoogleMapsModule,
    RelativeTimePipe,
    ViewShipmentComponent,
    ViewTrackingShipmentComponent,
    TabViewModule,
    DialogModule,
    ViewTrackingPackagesComponent,
    AutoCompleteModule,
    DateFormatPipe,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class ShipmentsComponent implements OnInit {
  private _shipmentService = inject(ShipmentService);
  private _packageService = inject(PackageService);
  private _employeeService = inject(EmployeeService);
  private _messageService = inject(MessageService);
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _fb = inject(FormBuilder);

  shipments$: Observable<Shipment[]> = EMPTY;
  loadingShipments = true;

  selectedShipment = signal<Shipment>({} as Shipment);
  shipmentDialog = false;

  employees = signal<Employee[]>([]);
  filteredEmployees = signal<Employee[]>([]);

  packages = signal<Package[]>([]);
  selectedPackages: Package[] = [];
  form: FormGroup = this._fb.group({
    carrier: [null, Validators.required],
  });

  ngOnInit(): void {
    this.shipments$ = this._shipmentService
      .getAll()
      .pipe(finalize(() => (this.loadingShipments = false)));
  }

  onGoDetail(id: string): void {
    this._router.navigate([id], { relativeTo: this._route });
  }

  onSelectedShipment(shipment: Shipment): void {
    this.selectedShipment.update((_) => shipment);
  }

  onFilter(dv: DataView, event: Event): void {
    dv.filter((event.target as HTMLInputElement).value, 'contains');
  }

  filterEmployees(event: any) {
    const filtered: Employee[] = [];
    const query = event.query;
    for (let i = 0; i < this.employees().length; i++) {
      const employee = this.employees()[i];
      if (employee.firstName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(employee);
      }
    }

    this.filteredEmployees.update(() => filtered);
  }

  openShipmentDialog(): void {
    this._employeeService
      .getAll()
      .subscribe((data) => this.employees.update((_) => data));

    this._packageService
      .getAllByQuery({ status: 'CREATED' })
      .subscribe((data) => this.packages.update((_) => data));

    this.shipmentDialog = true;
  }

  onSubmit(): void {
    const ids = this.selectedPackages.map((p) => p.id);

    const req = {
      carrierId: this.form.get('carrier')?.value.id,
      packagesIds: ids,
    } as ShipmentReq;

    this._shipmentService.create(req).subscribe({
      next: (response) => {
        this.shipments$ = this._shipmentService.getAll();
        this._messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Shipment Created',
          life: 3000,
        });
      },
      error: (error) => {
        console.error('Error creating package', error);
      },
      complete: () => {
        this.form.reset();
        this.shipmentDialog = false;
      },
    });
  }
}
