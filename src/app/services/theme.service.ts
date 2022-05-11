import { Injectable } from '@angular/core';

// Service provides theming functionality
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {
  }

  // Managing theme in local storage
  private setTheme(theme: string): void {
    localStorage.setItem('theme', theme);
  }

  // Retrieve theme, or default to light
  getTheme(): string {
    const theme = localStorage.getItem('theme');
    if (theme !== null) return theme;

    this.setTheme('light');
    return 'light';
  }

  toggleTheme(): void {
    this.getTheme() === 'light' ?
      this.setTheme('dark') : this.setTheme('light');
  }
}
