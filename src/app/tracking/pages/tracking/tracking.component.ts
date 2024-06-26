import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { Tracking } from '../../model/tracking';
import { PanelModule } from 'primeng/panel';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ActivatedRoute } from '@angular/router';
import { TrackingService } from '../../service/tracking.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { LatLng, decode } from '@googlemaps/polyline-codec';
import { GoogleMapsModule } from '@angular/google-maps';
import { TrackingSocketsService } from '../../websockets/tracking-sockets.service';

@Component({
  selector: 'app-tracking',
  standalone: true,
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.css',
  imports: [
    PanelModule,
    CardModule,
    DividerModule,
    DateFormatPipe,
    GoogleMap,
    MapAdvancedMarker,
    GoogleMapsModule,
  ],
})
export class TrackingComponent implements OnInit, AfterViewInit {
  private _router = inject(ActivatedRoute);
  private _trackingService = inject(TrackingService);
  private _trackingSocketService = inject(TrackingSocketsService);

  tracking: Tracking = {} as Tracking;
  id = '';

  options: google.maps.MapOptions = {
    center: {} as LatLng,
    streetViewControl: false,
    mapTypeControl: false,
    zoom: 17,
  };

  markerPosition?: LatLng;

  polylineOptions: google.maps.PolylineOptions = {
    path: [],
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 5,
  };

  ngOnInit(): void {
    this.id = this._router.snapshot.paramMap.get('id')!;

    this._trackingService.getById(this.id).subscribe((data) => {
      this.tracking = data;

      const center = {
        lat: this.tracking.latitude,
        lng: this.tracking.longitude,
      };

      this.options = { ...this.options, center: center };

      const path = decode(this.tracking.encodedPolyline).map((coords) => ({
        lat: coords[0],
        lng: coords[1],
      }));

      console.log(path);

      this.polylineOptions = { ...this.polylineOptions, path: path };
      this.markerPosition = center;
    });
  }

  ngAfterViewInit(): void {
    this._trackingSocketService.init();
    this._trackingSocketService
      .connect()
      .then(() => {
        this._trackingSocketService
          .subscribe('/topic/tracking/' + this.id)
          .subscribe({
            next: (message) => {
              this.tracking = message;
              this.markerPosition = {
                lat: this.tracking.latitude,
                lng: this.tracking.longitude,
              };
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
}
