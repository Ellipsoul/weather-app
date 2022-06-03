import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { getFirestore, Firestore } from '@angular/fire/firestore';
import { UserCredential, User } from '@angular/fire/auth';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { AdditionalUserInfo, getAdditionalUserInfo } from '@firebase/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit, OnDestroy {
  // Passes theme to parent component
  @Output() themeEvent = new EventEmitter<string>();
  currentTheme: string;
  firestore: Firestore;
  user: User | null | undefined;
  userSubscription: Subscription | undefined;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
  ) {
    // Retrieve initial theme value from theme service
    this.currentTheme = this.themeService.getTheme();
    this.firestore = getFirestore();
  }

  ngOnInit(): void {
    // Subscribe to the current theme from the theme service
    this.themeService.themeEvent.subscribe((theme: string) => this.currentTheme = theme);
    this.userSubscription = this.authService.user$.subscribe((user: User | null) => {
      this.user = user;
    });
  }

  // Toggles the theme and informs parent component
  toggleTheme():void {
    this.themeService.toggleTheme();
  }

  async googleSignIn(): Promise<void> {
    this.authService.signInWithGoogle().subscribe((userCredential: UserCredential) => {
      const additionaluserInfo: AdditionalUserInfo | null = getAdditionalUserInfo(userCredential);
      if (additionaluserInfo?.isNewUser) {
        console.log('new user');
      }
    });
  }

  signOut(): void {
    this.authService.signOut().subscribe(() => {
      console.log('signed out');
    });
  }


  // Unsubscribe from the theme service when the component is destroyed
  ngOnDestroy(): void {
    this.themeService.themeEvent.unsubscribe();
    this.userSubscription?.unsubscribe();
  }
}
