import { AfterViewInit, ChangeDetectionStrategy, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { DecimalPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-fullscreen-map',
  imports: [DecimalPipe],
  templateUrl: './fullscreen-map.html',
  styles: `
    div{
      width: 100vw;
      height: calc(100vh - 64px);
    }

    #controls{
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      position: fixed;
      bottom: 25px;
      right: 20px;
      z-index: 9999;
      box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
      width: 250px;

    }
  `
})
export default class FullscreenMap implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  zoom = signal(10);
  map = signal<mapboxgl.Map | null>(null);
  coordinates = signal({lat: -38.96, lng: -68.05});

  zoomEffect = effect(() => {
    if (!this.map) {
      return;
    }

    this.map()?.zoomTo(this.zoom());
  });

  mapListeners(map: mapboxgl.Map) {
    // Escucha el evento zoom con la rueda y establece el zoom en el mapa.
    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    })

    map.on('moveend',()=>{
      const center = map.getCenter()
      console.log({center});

      this.coordinates.set(center)
    })

    this.map.set(map);
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement()) return;
    const element = this.divElement()?.nativeElement;
    const {lat, lng} = this.coordinates();
    await new Promise((resolve) => setTimeout(resolve, 80))


    const map = new mapboxgl.Map({
      accessToken: `${environment.mapboxKey}`,
      container: element,
      style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
      projection: 'globe', // display the map as a globe
      zoom: this.zoom(), // initial zoom level, 0 is the world view, higher values zoom in
      center: [lng, lat] // center the map on this longitude and latitude
    });

    this.mapListeners(map);
  }

}
