import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { filter, map } from 'rxjs/operators';

import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'weather-app';
  public theme: string;

  constructor(
    private themeService: ThemeService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router) {
    this.theme = this.themeService.getTheme();
  }

  ngOnInit(): void {
    // Fun stuff that gets the page title from the router
    const appTitle = this.titleService.getTitle();
    this.router
        .events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map(() => {
              let child = this.route.firstChild!;
              while (child.firstChild) {
                child = child.firstChild;
              }
              if (child.snapshot.data['title']) {
                return child.snapshot.data['title'];
              }
              return appTitle;
            }),
        ).subscribe((ttl: string) => {
          this.titleService.setTitle(ttl);
        });
  }


  // Event handler that gets called when the theme changes
  themeEventHandler($event: any) {
    this.theme = $event;
  }
}
