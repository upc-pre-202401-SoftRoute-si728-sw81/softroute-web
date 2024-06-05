import { Component } from '@angular/core';
import { GpsComponent } from '../../components/gps/gps.component';
import { Dth22Component } from '../../components/dth22/dth22.component';
import { Tracking } from '../../model/tracking';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [GpsComponent, Dth22Component],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css'
})
export class TrackingComponent {

}
