import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-search-tracking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputGroupModule, InputGroupAddonModule],
  templateUrl: './search-tracking.component.html',
  styleUrl: './search-tracking.component.css'
})
export class SearchTrackingComponent {
  trackingNumber = new FormControl('', [Validators.required, Validators.minLength(3)]);
  showValidationError = false;
  constructor(private router: Router) { }

  onSearch() {
    this.showValidationError = true;
    if (this.trackingNumber.valid) {
      this.router.navigate(['/tracking', this.trackingNumber.value]);
    }
  }
}
