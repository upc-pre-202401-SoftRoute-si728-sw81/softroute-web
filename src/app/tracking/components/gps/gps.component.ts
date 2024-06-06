import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { ButtonModule } from 'primeng/button';
import { Location } from '../../model/location';

@Component({
  selector: 'app-gps',
  standalone: true,
  imports: [GoogleMap, MapAdvancedMarker, ButtonModule],
  templateUrl: './gps.component.html',
  styleUrl: './gps.component.css'
})
export class GpsComponent implements OnChanges {
  @Input() location!: Location | null;
  latitude!: number;
  longitude!: number;
  center!: google.maps.LatLngLiteral;
  zoom = 15;
  markerPositions: google.maps.LatLngLiteral[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['location'] && changes['location'].currentValue) {
      this.latitude = this.location?.latitude ?? 0;
      this.longitude = this.location?.longitude ?? 0;
      this.center = { lat: this.location?.latitude ?? 0 , lng: this.location?.longitude ?? 0 };
      if (this.markerPositions.length > 0) this.markerPositions.pop();
      this.markerPositions.push({ lat: this.location?.latitude ?? 0, lng: this.location?.longitude ?? 0 });
    }
  }
}

