import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentTheme: string;

  constructor(private themeService: ThemeService) {
    // Retrieve initial theme value from theme service
    this.currentTheme = this.themeService.getTheme();
  }

  ngOnInit() {
    // Subscribe to the current theme from the theme service
    this.themeService.themeEvent.subscribe((theme: string) => this.currentTheme = theme);
  }

  // Runs when user attempts to access their profile page
  async checkAuthentication():Promise<void> {
    // const user = await this.afAuth.currentUser;
    // if (user === null) {
    //   this.toaster.error('You must be logged in to view your notes', 'Oops!');
    // }
  }

  // Unsubscribe from the theme service when the component is destroyed
  ngOnDestroy(): void {
    this.themeService.themeEvent.unsubscribe();
  }
}
