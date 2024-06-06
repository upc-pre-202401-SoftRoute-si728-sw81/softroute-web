import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrackingService } from '../../service/tracking.service';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { Tracking } from '../../model/tracking';
import { Location } from '../../model/location'
import { ButtonModule } from 'primeng/button';
import { GpsService } from './gps.service';

@Component({
  selector: 'app-gps',
  standalone: true,
  imports: [GoogleMap, MapAdvancedMarker, ButtonModule],
  templateUrl: './gps.component.html',
  styleUrl: './gps.component.css'
})
export class GpsComponent implements OnInit, OnDestroy {
  private topicSubscription!: Subscription;
  center!: google.maps.LatLngLiteral;
  zoom = 15;
  latitude!: number;
  longitude!: number;
  markerPositions: google.maps.LatLngLiteral[] = [];

  constructor(private trackingService: TrackingService) { }

  public ngOnInit(): void {
    this.trackingService.connect().then(() => {
      this.topicSubscription = this.trackingService.subscribe("/topic/tracking/TRK1234").subscribe({
        next: (trackingData) => {
          this.latitude = trackingData.location.latitude;
          this.longitude = trackingData.location.longitude;
          this.center = { lat: trackingData.location.latitude, lng: trackingData.location.longitude };
          if (this.markerPositions.length >= 1) {
            this.markerPositions.pop();
          };
          this.markerPositions.push({ lat: trackingData.location.latitude, lng: trackingData.location.longitude });
          console.log('Received message: ', trackingData);
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

