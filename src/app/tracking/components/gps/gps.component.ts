import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrackingService } from '../../service/tracking.service';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { Tracking } from '../../model/tracking';

@Component({
  selector: 'app-gps',
  standalone: true,
  imports: [GoogleMap, MapAdvancedMarker],
  templateUrl: './gps.component.html',
  styleUrl: './gps.component.css',
})
export class GpsComponent /*implements OnInit, OnDestroy */ {
  //private topicSubscription!: Subscription;

  markerPositions: google.maps.LatLngLiteral[] = [
    { lat: -12.103907323663309, lng: -76.96375149242841 },
  ];

  options: google.maps.MapOptions = {
    center: { lat: -12.102085161346752, lng: -76.96294861993864 },
    streetViewControl: false,
    mapTypeControl: false,
    zoom: 15,
  };

  /*
  constructor(private trackingService: TrackingService) {}

  public ngOnInit(): void {
    this.trackingService
      .connect()
      .then(() => {
        this.topicSubscription = this.trackingService
          .subscribe('/topic/tracking/TRK1234')
          .subscribe({
            next: (message) => {
              this.positions.push(message);
              this.latitude = message.latitude;
              this.longitude = message.longitude;
              console.log('Received message: ', message);
            },
            error: (error) => {
              console.error('Subscription error: ', error);
            },
          });
      })
      .catch((error) => {
        console.error('Connection error: ', error);
      });
  }

  public ngOnDestroy() {
    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
    }
  }
  */
}
