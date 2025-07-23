import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  constructor() { }

  getMapsData() {
    return of({
      data: [
        { color: 0xff0000, x: -2, y: 1, z: 0 },
        { color: 0x00ff00, x: 2, y: -1, z: 0 },
        { color: 0x0000ff, x: 0, y: 0, z: 1 }
      ]
    });
  }
}
