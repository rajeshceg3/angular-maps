import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  private renderer: THREE.Renderer = new THREE.WebGLRenderer();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.http.get('/api/maps').pipe(
      map((response: any) => response.data)
    ).subscribe((mapsData: any) => {
      // process the maps data here
      mapsData.forEach((mapData: any) => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: mapData.color });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(mapData.x, mapData.y, mapData.z);
        this.scene.add(cube);
      });
    });

    this.camera.position.z = 5;

    this.animate();
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}
