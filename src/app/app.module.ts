import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { MapComponent } from './map/map.component';
import { GMapComponent } from './gmap/gmap.component';
import { HttpClientModule} from '@angular/common/http';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule, AgmCoreModule.forRoot({
    // !! IMPORTANT !!
    // Replace 'YOUR_PLACEHOLDER_API_KEY' with your actual Google Maps API key.
    apiKey: 'YOUR_PLACEHOLDER_API_KEY'
  }) ],
  declarations: [ AppComponent, HelloComponent, MapComponent,GMapComponent],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
