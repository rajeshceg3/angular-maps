import { Component, OnInit } from '@angular/core';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GMapComponent implements OnInit {
  private map: google.maps.Map;

  constructor(private apiWrapper: GoogleMapsAPIWrapper) { }

  ngOnInit(): void {
    this.apiWrapper.getNativeMap().then((map: google.maps.Map) => {
      this.map = map;
      this.map.setCenter({ lat: 37.7749, lng: -122.4194 });
      this.map.setZoom(12);
    });
  }
}
