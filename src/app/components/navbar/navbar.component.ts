import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

import { ThemeService } from 'src/app/services/theme.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentTheme: string;
  user: User | null | undefined;
  userSubscription: Subscription | undefined;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private toaster: ToastrService,
  ) {
    // Retrieve initial theme value from theme service
    this.currentTheme = this.themeService.getTheme();
  }

  ngOnInit() {
    // Subscribe to the current theme from the theme service
    this.themeService.themeEvent.subscribe((theme: string) => this.currentTheme = theme);
    // Keep track of currently authenticated user
    this.userSubscription = this.authService.user$.subscribe((user: User | null) => {
      this.user = user;
    });
  }

  // Inform user if not logged in
  checkAuthentication(): void {
    if (this.user) return;
    this.toaster.error('Please sign in to view your profile', 'Oops!');
  }

  // Unsubscribe from the theme service when the component is destroyed
  ngOnDestroy(): void {
    this.themeService.themeEvent.unsubscribe();
    this.userSubscription?.unsubscribe();
  }
}
