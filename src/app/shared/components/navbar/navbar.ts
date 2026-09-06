import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { routes } from '../../../app.routes';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'navbar',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  router = inject(Router);

  routes = routes.map(route => {
    return {
      path: route.path,
      title: `${route.title ?? 'Mapas'}`,
    }
  }).filter((route) => {
    return route.path !== '**'
  })
  // Sufijo '$' indica <Observable>
  pageTitle$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    // tap((event) => console.log(event)),
    map(event => event.url),
    map(url => routes.find( route => `/${route.path}` === url)?.title ?? 'Mapas'),
  );
}
