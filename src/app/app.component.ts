import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'weather-app';
  public theme: string;

  constructor(private themeService: ThemeService) {
    this.theme = this.themeService.getTheme();
    console.log(this.theme);
  }

  // Event handler that gets called when the theme changes
  themeEventHandler($event: any) {
    this.theme = $event;
  }
}
