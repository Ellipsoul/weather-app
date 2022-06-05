import { Injectable, Output, EventEmitter } from '@angular/core';

// Service provides theming functionality
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Initialize theme event emitter
  @Output() themeEvent = new EventEmitter<string>();

  constructor() {
    this.themeEvent.emit(this.getTheme());
  }

  // Managing theme in local storage
  private setTheme(theme: string): void {
    localStorage.setItem('theme', theme);
  }

  // Retrieve theme, or default to light if not found in local storage
  getTheme(): string {
    const theme = localStorage.getItem('theme');
    if (theme !== null) return theme;
    this.setTheme('light');
    return 'light';
  }

  // Toggle the theme, also emits the theme event to subscribed components
  toggleTheme(): void {
    this.getTheme() === 'light' ? this.setTheme('dark') : this.setTheme('light');
    this.themeEvent.emit(this.getTheme());
  }

  // Set to light theme and emit theme event to subscribed components
  setLightTheme(): void {
    this.setTheme('light');
    this.themeEvent.emit(this.getTheme());
  }

  // Set to dark theme and emit theme event to subscribed components
  setDarkTheme(): void {
    this.setTheme('dark');
    this.themeEvent.emit(this.getTheme());
  }
}
