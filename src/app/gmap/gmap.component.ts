import { Component } from '@angular/core';
import { MapInteractionService } from '../map-interaction.service'; // Adjusted path

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GMapComponent {
  // Default map center and zoom
  lat: number = 37.7749; // San Francisco
  lng: number = -122.4194;
  zoom: number = 5; // Adjusted zoom for a broader view

  constructor(private mapInteractionService: MapInteractionService) { }

  onMapClick(event: any) { // Use 'any' for event type for simplicity with agm-map event
    if (event && event.coords) {
      const lat = event.coords.lat;
      const lng = event.coords.lng;
      console.log(`Map clicked at: Lat: ${lat}, Lng: ${lng}`); // For debugging
      this.mapInteractionService.emitCoordinates(lat, lng);
    }
  }
}
