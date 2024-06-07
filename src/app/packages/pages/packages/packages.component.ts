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

import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PackageReq } from '../../models/package-req';
import { MessageService } from 'primeng/api';
import { CustomerService } from '../../../organization/services/customer.service';
import { Customer } from '../../../organization/models/customer';

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
    ReactiveFormsModule,
    ToastModule,
    AutoCompleteModule,
  ],
  providers: [MessageService],
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css',
})
export class PackagesComponent implements OnInit {
  private _packageService: PackageService = inject(PackageService);
  private _messageService: MessageService = inject(MessageService);
  private _customerService: CustomerService = inject(CustomerService);

  private _fb: FormBuilder = inject(FormBuilder);

  packages = signal<Package[]>([]);
  customers = signal<Customer[]>([]);

  filteredCustomers = signal<Customer[]>([]);

  packageDialog: boolean = false;
  submitted: boolean = false;

  form: FormGroup = this._fb.group({
    description: ['', Validators.required],
    weight: [null, [Validators.required, Validators.min(0)]],
    height: [null, [Validators.required, Validators.min(0)]],
    width: [null, [Validators.required, Validators.min(0)]],
    length: [null, [Validators.required, Validators.min(0)]],
    customer: [null, Validators.required],
  });

  display(customer: Customer): string {
    return `${customer.names} ${customer.surnames}`;
  }

  ngOnInit(): void {
    this._packageService.getAll().subscribe((data) => this.packages.set(data));
  }

  openAddDialog(): void {
    this.submitted = false;
    this.packageDialog = true;
    this._customerService.getAll().subscribe((data) => {
      this.customers.set(data);
    });
  }

  filterCustomer(event: any) {
    const filtered: Customer[] = [];
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
      const req = {
        ...this.form.getRawValue(),
        ownerId: this.form.get('customer')!.value.id,
      } as PackageReq;

      this._packageService.create(req).subscribe({
        next: (response) => {
          const updated = this.packages();
          updated.push(response);
          this.packages.update(() => updated);
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
