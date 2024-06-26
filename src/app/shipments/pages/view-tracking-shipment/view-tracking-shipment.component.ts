import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Shipment } from '../../models/shipment';
import { GoogleMapsModule } from '@angular/google-maps';
import { LatLng, decode } from '@googlemaps/polyline-codec';
import { TrackingSocketsService } from '../../../tracking/websockets/tracking-sockets.service';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Marker } from '../../models/marker';
import { Location } from '../../../packages/models/location';

@Component({
  selector: 'app-view-tracking-shipment',
  standalone: true,
  imports: [GoogleMapsModule, TableModule, CommonModule],
  templateUrl: './view-tracking-shipment.component.html',
  styleUrl: './view-tracking-shipment.component.css',
})
export class ViewTrackingShipmentComponent
  implements OnChanges, AfterViewInit, OnInit
{
  ngOnInit(): void {}
  private _trackingSocketService = inject(TrackingSocketsService);
  @Input() shipment?: Shipment;

  center: LatLng = {} as LatLng;

  options: google.maps.MapOptions = {
    center: this.center,
    streetViewControl: false,
    mapTypeControl: false,
    zoom: 17,
  };

  currentMarker?: LatLng;
  destinationMarkers?: Marker[];
  animationFrameId?: number;

  currentMarkerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    content: null,
  };

  destinationMarkerOptions: google.maps.marker.AdvancedMarkerElementOptions = {
    content: null,
  };

  polylineOptions: google.maps.PolylineOptions = {
    path: [],
    strokeColor: '#000000',
    strokeOpacity: 1.0,
    strokeWeight: 6,
  };

  ngOnChanges(changes: SimpleChanges): void {
    const packageImg = document.createElement('img');
    const shipmentImg = document.createElement('img');
    packageImg.src = 'assets/images/marker-box.png';
    shipmentImg.src = 'assets/images/delivery-truck.png';
    packageImg.style.height = '3rem';
    shipmentImg.style.height = '3rem';

    this.center = {
      lat: this.shipment?.location.latitude!,
      lng: this.shipment?.location.longitude!,
    };

    this.options = { ...this.options, center: this.center };

    const path = decode(this.shipment?.encodedPolyline!).map((coords) => ({
      lat: coords[0],
      lng: coords[1],
    }));

    this.polylineOptions = { ...this.polylineOptions, path: path };

    this.currentMarker = this.center!;

    this.destinationMarkers = this.shipment?.destinations.map((d) => ({
      position: {
        lat: d.lat,
        lng: d.lng,
      },
      options: {
        icon: packageImg.src,
        title: 'Destination',
      },
    }));

    console.log(this.destinationMarkers);

    this.currentMarkerOptions = {
      ...this.currentMarkerOptions,
      content: shipmentImg,
    };
  }

  ngAfterViewInit(): void {
    this._trackingSocketService.init();
    this._trackingSocketService
      .connect()
      .then(() => {
        this._trackingSocketService
          .subscribe('/topic/shipment/' + this.shipment?.code)
          .subscribe({
            next: (message) => {
              const newLocation = {
                lat: message.location?.latitude!,
                lng: message.location?.longitude!,
              };
              const location = { ...message.location } as Location;
              const packagesDelivered = message.packagesDelivered;
              const status = message.status;

              this.shipment = {
                ...this.shipment!,
                location,
                packagesDelivered,
                status,
              };
              this.animateMarker(this.currentMarker!, newLocation);
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

  animateMarker(start: LatLng, end: LatLng): void {
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      const lat = start.lat + (end.lat - start.lat) * progress;
      const lng = start.lng + (end.lng - start.lng) * progress;

      this.currentMarker = { lat, lng };

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(animate);
      }
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }
}
