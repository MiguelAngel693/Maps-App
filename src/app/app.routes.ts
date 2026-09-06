import { Routes } from '@angular/router';
import { Markers } from './pages/markers/markers';
import { Houses } from './pages/houses/houses';
import FullscreenMap from './pages/fullscreen-map/fullscreen-map';

export const routes: Routes = [
  {
    path: 'fullscreen',
    component: FullscreenMap,
    title: 'FullScreen'
  },
  {
    path: 'markers',
    component: Markers,
    title: 'Markers'
  },
  {
    path: 'houses',
    component: Houses,
    title: 'Houses'
  },
  {
    path: '**',
    redirectTo: 'fullscreen'
  },

];
