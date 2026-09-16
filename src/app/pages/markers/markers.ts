import { ChangeDetectionStrategy, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl, { LngLatLike, MapMouseEvent } from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { DecimalPipe } from '@angular/common';

interface Marker {
  id: string,
  mapboxMarker: mapboxgl.Marker,
}

@Component({
  selector: 'app-markers',
  imports: [DecimalPipe],
  templateUrl: './markers.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Markers {
  divElement = viewChild<ElementRef>('map');
  zoom = signal(10);
  map = signal<mapboxgl.Map | null>(null);
  coordinates = signal({ lat: -38.951844251137835, lng: -68.05916053744693 });
  markers = signal<Marker[]>([]);

  color = () => {
    return '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    )
  };

  zoomEffect = effect(() => {
    if (!this.map) {
      return;
    }

    this.map()?.zoomTo(this.zoom());
  });

  mapListeners(map: mapboxgl.Map) {

    map.on('click', (event) => this.mapClick(event)
      // {
      // const newMarker = new mapboxgl.Marker().setLngLat(event.lngLat).addTo(map);
      // }
    );

    this.map.set(map);
  }

  mapClick(event: MapMouseEvent) {
    if (!this.map) return;
    const map = this.map()!;

    const mapboxMarker = new mapboxgl.Marker({ color: this.color() }).setLngLat(event.lngLat).addTo(map);
    const newMarker: Marker = {
      id: '' + Math.floor(Math.random() * 10000000001),
      mapboxMarker: mapboxMarker
    }
    this.markers.update((markers) => [...markers, newMarker])

    console.log(this.markers());

  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.divElement()) return;
    const element = this.divElement()?.nativeElement;
    const { lat, lng } = this.coordinates();
    await new Promise((resolve) => setTimeout(resolve, 80))


    const map = new mapboxgl.Map({
      accessToken: `${environment.mapboxKey}`,
      container: element,
      style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
      projection: 'globe', // display the map as a globe
      zoom: this.zoom(), // initial zoom level, 0 is the world view, higher values zoom in
      center: [lng, lat] // center the map on this longitude and latitude
    });

    const marker = new mapboxgl.Marker({}).setLngLat([-68.05, -38.96]).addTo(map);

    this.mapListeners(map);
  }

  flyToMarker(lngLat: LngLatLike) {
    if (!this.map) return;

    this.map()?.flyTo({
      center: lngLat
    })
  }

  deleteMarker(marker: Marker) {
    if (!this.map()) return;
    const map = this.map()!;

    marker.mapboxMarker.remove();

    this.markers.set(this.markers().filter((m) => m.id !== marker.id));
    // this.markers.update(this.markers().filter((m) => m.id !== marker.id));
  }

}
