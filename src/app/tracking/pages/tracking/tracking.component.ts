import { Component, OnDestroy, OnInit } from '@angular/core';
import { GpsComponent } from '../../components/gps/gps.component';
import { Dth22Component } from '../../components/dth22/dth22.component';
import { ButtonModule } from 'primeng/button';
import { TrackingService } from '../../service/tracking.service';
import { Subscription } from 'rxjs';
import { Tracking } from '../../model/tracking';

@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [GpsComponent, Dth22Component, ButtonModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css'
})
export class TrackingComponent implements OnInit, OnDestroy {
  private topicSubscription!: Subscription;
  tracking!: Tracking;
  constructor(private trackingService: TrackingService) { }

  ngOnInit(): void {
    this.trackingService.connect().then(() => {
      this.topicSubscription = this.trackingService.subscribe("/topic/tracking/TRK1234").subscribe({
        next: (trackingData) => {
          this.tracking = trackingData;
          console.log('Received message: ', trackingData);
        },
        error: (error) => {
          console.error('Subscription error: ', error);
        }
      });
    }).catch(error => {
      console.error("Connection error: ", error);
    });
  }

  ngOnDestroy(): void {
    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
    }
  }
}
