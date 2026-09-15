import { ChangeDetectionStrategy, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl, { LngLat, MapMouseEvent } from 'mapbox-gl';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-markers',
  imports: [],
  templateUrl: './markers.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    div{
      width: 100vw;
      height: calc(100vh - 64px);
    }
    `
})
export class Markers {
  divElement = viewChild<ElementRef>('map');
  zoom = signal(10);
  map = signal<mapboxgl.Map | null>(null);
  coordinates = signal({ lat: -38.951844251137835, lng: -68.05916053744693 });

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

    map.on('click',(event)=> this.mapClick(event)
      // {
      // const newMarker = new mapboxgl.Marker().setLngLat(event.lngLat).addTo(map);
      // }
    );

    this.map.set(map);
  }

  mapClick(event: MapMouseEvent){
    if(!this.map) return;
    const map = this.map()!;

    const newMarker = new mapboxgl.Marker({color: this.color()}).setLngLat(event.lngLat).addTo(map);
    console.log(event.lngLat);

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

}
