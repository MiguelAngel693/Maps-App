import { ChangeDetectionStrategy, Component, effect, ElementRef, input, signal, viewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import mapboxgl, { LngLat } from 'mapbox-gl';

@Component({
  selector: 'minimap',
  imports: [],
  templateUrl: './minimap.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Minimap {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  coordinates = input.required<{lng: number, lat: number}>();

  mapListeners(map: mapboxgl.Map) {
    this.map.set(map);
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement()) return;
    const element = this.divElement()?.nativeElement;
    await new Promise((resolve) => setTimeout(resolve, 80))


    const map = new mapboxgl.Map({
      accessToken: `${environment.mapboxKey}`,
      container: element,
      projection: 'globe', // display the map as a globe
      zoom: 14, // initial zoom level, 0 is the world view, higher values zoom in
      center: this.coordinates(), // center the map on this longitude and latitude
      interactive: false
    });

    const marker = new mapboxgl.Marker().setLngLat(this.coordinates()).addTo(map);
    this.mapListeners(map);
  }
}
