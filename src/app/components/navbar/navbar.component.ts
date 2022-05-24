import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  // Passes theme to parent component
  @Output() themeEvent = new EventEmitter<string>();
  currentTheme: string;

  constructor(
    private themeService: ThemeService,
  ) {
    this.currentTheme = this.themeService.getTheme();
  }

  ngOnInit(): void {
  }

  // Toggles the theme and informs parent component
  toggleTheme():void {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.getTheme();
    this.themeEvent.emit(this.currentTheme);
  }
}
