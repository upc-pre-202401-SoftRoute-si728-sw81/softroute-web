import { Component, OnInit, inject, signal } from '@angular/core';
import { PackageService } from '../../services/package.service';
import { Package } from '../../models/package';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PackageReq } from '../../models/package-req';
import { MessageService } from 'primeng/api';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { DropdownModule } from 'primeng/dropdown';
import { ClientService } from '../../../organization/services/client.service';
import { Client } from '../../../organization/models/client';
import { DataView, DataViewModule } from 'primeng/dataview';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { PanelModule } from 'primeng/panel';
import { EMPTY, Observable, finalize } from 'rxjs';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [
    TableModule,
    ToolbarModule,
    ButtonModule,
    DialogModule,
    InputTextareaModule,
    FormsModule,
    CommonModule,
    InputNumberModule,
    InputTextModule,
    PanelModule,
    ReactiveFormsModule,
    DataViewModule,
    ToastModule,
    AutoCompleteModule,
    DateFormatPipe,
    DividerModule,
    DropdownModule,
    RelativeTimePipe,
  ],
  providers: [MessageService],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css',
})
export class PackagesComponent implements OnInit {
  private _packageService: PackageService = inject(PackageService);
  private _messageService: MessageService = inject(MessageService);
  private _customerService: ClientService = inject(ClientService);

  private _fb: FormBuilder = inject(FormBuilder);

  packages$: Observable<Package[]> = EMPTY;
  loadingPackages = true;

  customers = signal<Client[]>([]);

  selectedPackage = signal<Package>({} as Package);

  filteredCustomers = signal<Client[]>([]);

  packageDialog: boolean = false;
  submitted: boolean = false;

  form: FormGroup = this._fb.group({
    description: ['', Validators.required],
    weight: [null, [Validators.required, Validators.min(0)]],
    height: [null, [Validators.required, Validators.min(0)]],
    width: [null, [Validators.required, Validators.min(0)]],
    length: [null, [Validators.required, Validators.min(0)]],
    minTemperature: [
      null,
      [Validators.required, Validators.min(-100), Validators.max(100)],
    ],
    maxTemperature: [
      null,
      [Validators.required, Validators.min(-100), Validators.max(100)],
    ],
    minHumidity: [null, [Validators.required, Validators.min(0)]],
    maxHumidity: [
      null,
      [Validators.required, Validators.min(0), Validators.max(100)],
    ],
    destinationAddress: [null, [Validators.required]],
    customer: [null, Validators.required],
  });

  display(customer: Client): string {
    return `${customer.names} ${customer.surnames}`;
  }

  ngOnInit(): void {
    this.packages$ = this._packageService
      .getAll()
      .pipe(finalize(() => (this.loadingPackages = false)));
  }

  openAddDialog(): void {
    this.submitted = false;
    this.packageDialog = true;
    this._customerService.getAll().subscribe((data) => {
      this.customers.set(data);
    });
  }

  onSelectPackage(selectedPackage: Package): void {
    this.selectedPackage.update((_) => selectedPackage);
  }

  onFilter(dv: DataView, event: Event): void {
    dv.filter((event.target as HTMLInputElement).value, 'contains');
  }

  filterCustomer(event: any) {
    const filtered: Client[] = [];
    const query = event.query;
    for (let i = 0; i < this.customers().length; i++) {
      const customer = this.customers()[i];
      if (customer.names.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(customer);
      }
    }

    this.filteredCustomers.update(() => filtered);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { customer, ...rest } = this.form.getRawValue();

      const req = {
        ...rest,
        customerId: this.form.get('customer')!.value.id,
      } as PackageReq;

      console.log(req);
      this._packageService.create(req).subscribe({
        next: (response) => {
          this.packages$ = this._packageService.getAll();
          this._messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Package Created',
            life: 3000,
          });
        },
        error: (error) => {
          console.error('Error creating package', error);
        },
        complete: () => {
          this.form.reset();
          this.packageDialog = false;
        },
      });
    }
  }
}
