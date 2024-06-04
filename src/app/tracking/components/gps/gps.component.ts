import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrackingService } from '../../service/tracking.service';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-gps',
  standalone: true,
  imports: [GoogleMap],
  templateUrl: './gps.component.html',
  styleUrl: './gps.component.css'
})
export class GpsComponent implements OnInit, OnDestroy {
  public positions: any[] = [];
  private topicSubscription!: Subscription;
  // center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  // zoom = 4;

  constructor(private trackingService: TrackingService) { }

  public ngOnInit(): void {
    this.trackingService.connect().then(() => {
      this.topicSubscription = this.trackingService.subscribe("/topic/tracking").subscribe({
        next: (message) => {
          this.positions.push(message);
          console.log('Received message: ', message);
        },
        error: (error) => {
          console.error('Subscription error: ', error);
        }
      });
    }).catch(error => {
      console.error("Connection error: ", error);
    });
  };

  public ngOnDestroy() {
    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
    }
  };
}

