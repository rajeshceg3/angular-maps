import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface MapCoordinates {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapInteractionService {
  private coordinatesSubject = new BehaviorSubject<MapCoordinates | null>(null);

  constructor() { }

  // Method to emit new coordinates
  public emitCoordinates(lat: number, lng: number): void {
    this.coordinatesSubject.next({ lat, lng });
  }

  // Observable for components to subscribe to coordinate changes
  public getCoordinates(): Observable<MapCoordinates | null> {
    return this.coordinatesSubject.asObservable();
  }
}
