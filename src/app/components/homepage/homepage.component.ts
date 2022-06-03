import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild,
  AfterViewInit } from '@angular/core';
import { getFirestore, Firestore } from '@angular/fire/firestore';
import { UserCredential, User } from '@angular/fire/auth';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ToastrService } from 'ngx-toastr';
import { AdditionalUserInfo, getAdditionalUserInfo } from '@firebase/auth';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit, OnDestroy, AfterViewInit {
  // Passes theme to parent component
  @Output() themeEvent = new EventEmitter<string>();
  currentTheme: string;

  // Firebase objects
  firestore: Firestore;
  user: User | null | undefined;
  userSubscription: Subscription | undefined;

  // Mobile Device management
  isMobile: boolean;
  @ViewChild('drawer') drawer: MatDrawer | undefined;

  isDrawerOpen: boolean | undefined;
  drawerStatusSubscription: Subscription | undefined;

  drawerClosing: boolean | undefined;
  drawerClosingSubscription: Subscription | undefined;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private deviceService: DeviceDetectorService,
    private toaster: ToastrService,
  ) {
    // Retrieve initial theme value from theme service
    this.currentTheme = this.themeService.getTheme();
    this.firestore = getFirestore();
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    // Subscribe to the current theme from the theme service
    this.themeService.themeEvent.subscribe((theme: string) => this.currentTheme = theme);
    this.userSubscription = this.authService.user$.subscribe((user: User | null) => {
      this.user = user;
    });
  }

  // Subscribe to drawer status after view is initialized
  ngAfterViewInit(): void {
    this.drawerStatusSubscription = this.drawer?.openedChange.subscribe((isOpen: boolean) => {
      this.isDrawerOpen = isOpen;
      this.drawerClosing = false;
    });
    this.drawerClosingSubscription = this.drawer?.closedStart.subscribe(() => {
      this.drawerClosing = true;
    });
  }

  // Toggles the theme and informs parent component
  toggleTheme():void {
    this.themeService.toggleTheme();
  }

  // Calls auth service to sign in with Google
  async googleSignIn(): Promise<void> {
    this.authService.signInWithGoogle().subscribe({
      next: (userCredential: UserCredential) => {
        // Handle new user creation
        const additionaluserInfo: AdditionalUserInfo | null = getAdditionalUserInfo(userCredential);
        if (additionaluserInfo?.isNewUser) {
          this.firestoreService.createNewUser(userCredential.user).subscribe({
            next: () => {
              this.toaster.success('New User Created', 'Success!');
            },
            error: (error: Error) => {
              this.toaster.error('Failed to Create New User', 'Error!');
              console.log(error);
            },
          });
        }
        // Google authentication successful
        this.toaster.success('Signed in with Google', 'Success!');
      },
      error: (error: Error) => {
        this.toaster.error('Failed to Sign In', 'Error!');
        console.log(error);
      },
    });
  }

  // Signs user out of Firebase
  signOut(): void {
    this.authService.signOut().subscribe({
      next: () => {
        this.toaster.success('Signed Out', 'Success!');
      },
      error: (error: Error) => {
        this.toaster.error('Failed to Sign Out', 'Error!');
        console.log(error);
      },
    });
  }

  // Unsubscribe from the theme service when the component is destroyed
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.drawerStatusSubscription?.unsubscribe();
    this.drawerClosingSubscription?.unsubscribe();
  }
}
