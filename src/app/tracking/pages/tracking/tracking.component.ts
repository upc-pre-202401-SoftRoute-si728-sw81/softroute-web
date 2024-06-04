import { Component } from '@angular/core';
import { GpsComponent } from '../../components/gps/gps.component';
import { Dth22Component } from '../../components/dth22/dth22.component';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [GpsComponent, Dth22Component],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css'
})
export class TrackingComponent {
  tracking: Tracking = {
    "id": "555e4567-e89b-12d3-a456-426614174000",
    "deviceId": "132e4567-e89b-12d3-a456-426614174000",
    "trackingNumber": "TRK1234",
    "trackingStatus": {
      "id": "222e4567-e89b-12d3-a456-426614175000",
      "status": "DELIVERED",
      "statusDetails": "Package delivered to the recipient",
      "statusDate": "2024-04-01T15:00:00"
    }
  }
}
