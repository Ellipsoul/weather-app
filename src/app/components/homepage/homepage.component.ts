import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild,
  AfterViewInit, NgZone } from '@angular/core';
import { getFirestore, Firestore } from '@angular/fire/firestore';
import { UserCredential, User } from '@angular/fire/auth';

import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';

import { AdditionalUserInfo, getAdditionalUserInfo } from '@firebase/auth';
import { Subscription, debounceTime, distinctUntilChanged, filter,
  switchMap,
  tap } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { FormControl, Validators } from '@angular/forms';
import { WeatherapiService, WeatherApiLocation } from 'src/app/services/weatherapi.service';

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
  // Checking the status of the drawer
  isDrawerOpen: boolean | undefined;
  drawerStatusSubscription: Subscription | undefined;
  // Checking if the drawer is currently closing
  drawerClosing: boolean | undefined;
  drawerClosingSubscription: Subscription | undefined;
  // Dynamic variable to show correct weather display
  showForecastWeather: boolean | undefined;
  // Autocomplete input for weather location query
  weatherLocationInput =
    new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
  filteredLocations$: Subscription;
  filteredLocationNames: string[] | undefined;
  autocompleteLoading: boolean | undefined;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private deviceService: DeviceDetectorService,
    private toaster: ToastrService,
    private ngZone: NgZone,
    private weatherapiService: WeatherapiService,
  ) {
    this.autocompleteLoading = false;
    // Retrieve initial theme value from theme service
    this.currentTheme = this.themeService.getTheme();
    this.firestore = getFirestore();
    this.isMobile = this.deviceService.isMobile();
    this.filteredLocations$ = this.weatherLocationInput.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        filter((name) => name.length > 2),
        tap(() => {
          this.autocompleteLoading = true;
        }),
        switchMap((name) => this.weatherapiService.getAutoComplete(name)),
    ).subscribe((locationdata: any) => {
      this.filteredLocationNames = locationdata.data.map(
          (location: WeatherApiLocation) => location.name);
      this.autocompleteLoading = false;
    },
    );
  }

  ngOnInit(): void {
    // Subscribe to the current theme from the theme service
    this.themeService.themeEvent.subscribe((theme: string) => this.currentTheme = theme);
    this.userSubscription = this.authService.user$.subscribe((user: User | null) => {
      this.ngZone.run(() => {
        this.user = user;
      });
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
              this.toaster.success('New User Created', 'Welcome!');
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

  onChange($event: any) {
    this.showForecastWeather = $event.checked;
  }

  // Unsubscribe from the theme service when the component is destroyed
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.drawerStatusSubscription?.unsubscribe();
    this.drawerClosingSubscription?.unsubscribe();
  }
}
