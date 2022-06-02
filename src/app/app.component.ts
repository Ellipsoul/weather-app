import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { filter, map } from 'rxjs/operators';

import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SkyStory';
  public currentTheme: string;

  constructor(
    private themeService: ThemeService,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router) {
    // Retrieve initial theme value from theme service
    this.currentTheme = this.themeService.getTheme();
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
    // Subscribe to the current theme from the theme service
    this.themeService.themeEvent.subscribe((theme: string) => this.currentTheme = theme);
  }

  // Unsubscribe from the theme service when the component is destroyed
  ngOnDestroy(): void {
    this.themeService.themeEvent.unsubscribe();
  }
}
