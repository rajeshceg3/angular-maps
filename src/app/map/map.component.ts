import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Subscription } from 'rxjs';
import { MapInteractionService, MapCoordinates } from '../map-interaction.service';
import { MockDataService } from '../mock-data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('threeContainer') private containerRef: ElementRef;

  private scene: THREE.Scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
  private controls: OrbitControls;
  private animationFrameId: number;
  private dataSubscription: Subscription;
  private mapClickSubscription: Subscription;

  constructor(private mockDataService: MockDataService, private mapInteractionService: MapInteractionService) { }

  ngOnInit(): void {
    this.dataSubscription = this.mockDataService.getMapsData().subscribe((mapsData: any) => {
      if (mapsData && Array.isArray(mapsData.data)) {
        mapsData.data.forEach((mapData: any) => {
          const geometry = new THREE.BoxGeometry(1, 1, 1);
          const material = new THREE.MeshBasicMaterial({ color: mapData.color || 0x00ff00 });
          const cube = new THREE.Mesh(geometry, material);
          cube.position.set(mapData.x || 0, mapData.y || 0, mapData.z || 0);
          this.scene.add(cube);
        });
      } else {
        console.warn('No map data received or data is not an array');
      }
    }, error => {
      console.error('Error fetching map data:', error);
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const cube = new THREE.Mesh(geometry, material);
      this.scene.add(cube);
    });

    this.mapClickSubscription = this.mapInteractionService.getCoordinates().subscribe(coords => {
      if (coords) {
        console.log('Received coordinates in MapComponent:', coords); // For debugging
        const geometry = new THREE.SphereGeometry(0.2, 16, 16); // Smaller sphere
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color for new objects
        const sphere = new THREE.Mesh(geometry, material);

        // Simple mapping of lat/lng to x/y. Z can be 0 or a small fixed value.
        // Adjust scaling/mapping as needed if objects are too far or too small.
        sphere.position.set(coords.lng / 10, coords.lat / 10, 0); // Scaled down to fit typical scene

        this.scene.add(sphere);
        console.log('Added new sphere to scene at:', sphere.position); // For debugging
      }
    });
  }

  ngAfterViewInit(): void {
    const container = this.containerRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    // Add an initial placeholder cube
    const placeholderGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8); // Slightly smaller
    const placeholderMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Blue
    const placeholderCube = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
    placeholderCube.position.set(-1.5, 0, 0); // Position it to the side
    this.scene.add(placeholderCube);

    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
    if (this.mapClickSubscription) {
      this.mapClickSubscription.unsubscribe();
    }
    if (this.renderer) {
      // Dispose of renderer and its resources if needed, though Angular might remove the canvas
      // this.renderer.dispose(); // More complex cleanup
    }
    if (this.scene) {
        // Traverse the scene and dispose of geometries, materials, textures
        this.scene.traverse(object => {
            if (object instanceof THREE.Mesh) {
                if (object.geometry) {
                    object.geometry.dispose();
                }
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            }
        });
    }
    // Remove the canvas from the container if it's still there
    if (this.containerRef && this.containerRef.nativeElement && this.renderer.domElement.parentNode === this.containerRef.nativeElement) {
        this.containerRef.nativeElement.removeChild(this.renderer.domElement);
    }
  }

  animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    if (this.camera && this.scene && this.renderer) { // Ensure objects are initialized
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
  }
}
