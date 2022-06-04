import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild,
  AfterViewInit, NgZone } from '@angular/core';
import { getFirestore, Firestore } from '@angular/fire/firestore';
import { UserCredential, User } from '@angular/fire/auth';

import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { FirestoreService, WeatherQuery } from 'src/app/services/firestore.service';
import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';

import { AdditionalUserInfo, getAdditionalUserInfo } from '@firebase/auth';
import { Subscription, debounceTime, distinctUntilChanged, filter,
  switchMap, tap } from 'rxjs';
import { MatDrawer } from '@angular/material/sidenav';
import { FormControl, Validators } from '@angular/forms';
import { WeatherapiService, WeatherAutocompleteLocation,
  WeatherType, WeatherLiveResponse, WeatherForecastResponse,
} from 'src/app/services/weatherapi.service';
import { AxiosResponse } from 'axios';
import { PastqueriesService } from 'src/app/services/pastqueries.service';

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
    new FormControl('', [Validators.minLength(3), Validators.maxLength(50)]);
  filteredLocations$: Subscription;
  emptyLocations: Subscription;
  filteredLocationNames: string[] | undefined;
  autocompleteLoading: boolean | undefined;
  // Weather data to be passed to children
  liveWeatherData: WeatherLiveResponse | undefined;
  forecastWeatherData: WeatherForecastResponse | undefined;
  // Past weather queries by user
  pastQueries: WeatherQuery[] = [];
  pastQueriesSubscription: Subscription | undefined;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private deviceService: DeviceDetectorService,
    private toaster: ToastrService,
    private ngZone: NgZone,
    private weatherapiService: WeatherapiService,
    private pastqueriesService: PastqueriesService,
  ) {
    this.autocompleteLoading = false;
    // Retrieve initial theme value from theme service
    this.currentTheme = this.themeService.getTheme();
    // Get firestore object and device
    this.firestore = getFirestore();
    this.isMobile = this.deviceService.isMobile();
    // Subscription for filtered location names
    this.filteredLocations$ = this.weatherLocationInput.valueChanges.pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        filter((name) => name && name.length > 2),
        tap(() => {
          this.autocompleteLoading = true;
        }),
        switchMap((name) => this.weatherapiService.getAutoComplete(name)),
    ).subscribe((locationdata: any) => {
      this.filteredLocationNames = locationdata.data.map(
          (location: WeatherAutocompleteLocation) => `${location.name}, ${location.country}`);
      this.autocompleteLoading = false;
    });
    // Subscribe to filtered locations to see if they need to be cleared
    this.emptyLocations = this.weatherLocationInput.valueChanges.subscribe((name) => {
      if (!name || name.length < 3) {
        this.filteredLocationNames = undefined;
      }
    });
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

  // Change whether to show weather forecast or live weather
  toggleWeatherView($event: any) {
    this.showForecastWeather = $event.checked;
  }

  // Retrieve weather from weather api
  getWeather(): void {
    const weatherType: WeatherType =
    this.showForecastWeather ? WeatherType.Forecast : WeatherType.Live;
    if (weatherType === WeatherType.Live) {
      this.weatherapiService.getLiveWeather(this.weatherLocationInput.value).subscribe({
        next: (weatherData: AxiosResponse<WeatherLiveResponse>) => {
          this.liveWeatherData = weatherData.data;
          // If the user is logged in, save the weather data to their profile
          if (this.user) {
            this.firestoreService.logLiveWeatherQuery(this.user, this.weatherLocationInput.value);
            this.weatherLocationInput.reset();
          }
        },
        error: (error: Error) => {
          this.toaster.error('Failed to live weather', 'Error!');
          console.log(error);
        },
      });
    } else {
      this.weatherapiService.getForecastWeather(this.weatherLocationInput.value).subscribe({
        next: (weatherData: AxiosResponse<WeatherForecastResponse>) => {
          this.forecastWeatherData = weatherData.data;
          // If the user is logged in, save the weather data to their profile
          if (this.user) {
            this.firestoreService.logForecastWeatherQuery(
                this.user, this.weatherLocationInput.value);
          };
          this.weatherLocationInput.reset();
        },
        error: (error: Error) => {
          this.toaster.error('Failed to forecast weather', 'Error!');
          console.log(error);
        },
      });
    }
  }

  // Unsubscribe from the theme service when the component is destroyed
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
    this.drawerStatusSubscription?.unsubscribe();
    this.drawerClosingSubscription?.unsubscribe();
    this.emptyLocations?.unsubscribe();
    this.filteredLocations$?.unsubscribe();
  }
}
