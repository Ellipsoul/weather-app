import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit, OnDestroy {
  // Passes theme to parent component
  @Output() themeEvent = new EventEmitter<string>();
  currentTheme: string;

  constructor(
    private themeService: ThemeService,
  ) {
    // Retrieve initial theme value from theme service
    this.currentTheme = this.themeService.getTheme();
  }

  ngOnInit(): void {
    // Subscribe to the current theme from the theme service
    this.themeService.themeEvent.subscribe((theme: string) => this.currentTheme = theme);
  }

  showFiller = false;

  // Toggles the theme and informs parent component
  toggleTheme():void {
    this.themeService.toggleTheme();
  }

  // Unsubscribe from the theme service when the component is destroyed
  ngOnDestroy(): void {
    this.themeService.themeEvent.unsubscribe();
  }
}
