import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map-google',
  standalone: true,
  imports: [GoogleMap, MapMarker, CommonModule, GoogleMapsModule],
  templateUrl: './map-google.component.html',
  styleUrl: './map-google.component.scss'
})
export class MapGoogleComponent {
  @Input() center: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  @Input() zoom = 8;
  @Input() markers: any[] = [];
  @Input() options: google.maps.MapOptions = {};
  @Input() radius: number = 0; // Radius in kilometers
  @Input() circleOptions: google.maps.CircleOptions = {
    fillColor: '#FF0000',
    fillOpacity: 0.3,
    strokeColor: '#FF0000',
    strokeOpacity: 0.5,
    strokeWeight: 2,
  };
  @ViewChild('map', { static: false }) map!: GoogleMap;

  ngOnInit() {
    // Additional initialization if needed
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    // Handle map click events
  }
  get radiusInMeters(): number {
    return this.radius * 1000; // Convert kilometers to meters
  }

}
