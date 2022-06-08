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
import { WeatherdataService } from 'src/app/services/weatherdata.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';

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
  // Past weather queries by user
  pastQueries: WeatherQuery[] = [];
  pastQueriesSubscription: Subscription | undefined;
  // Control state of the slide toggle
  @ViewChild('slideToggle') slideToggle: MatSlideToggle | undefined;
  // Live and Forecast Weather data objects
  liveWeatherData: WeatherLiveResponse | undefined;
  forecastWeatherData: WeatherForecastResponse | undefined;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private deviceService: DeviceDetectorService,
    private toaster: ToastrService,
    private ngZone: NgZone,
    private weatherapiService: WeatherapiService,
    private pastqueriesService: PastqueriesService,
    private weatherdataService: WeatherdataService,
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
        debounceTime(250),
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
    // Subscribe to the live and forecast weather data
    this.weatherdataService.forecastWeatherData.subscribe((data: WeatherForecastResponse) => {
      this.forecastWeatherData = data;
    });
    this.weatherdataService.liveWeatherData.subscribe((data: WeatherLiveResponse) => {
      this.liveWeatherData = data;
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
    // Subscribe to the previous queries from the past queries service
    this.pastQueriesSubscription = this.pastqueriesService.pastQueries
        .subscribe((queries: WeatherQuery[]) => {
          this.pastQueries = queries;
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

  // Change whether to show weather forecast or live weather, and potentially fetch weather
  toggleWeatherView($event: any) {
    // If user has existing query, fetch weather data for other view
    if (this.showForecastWeather && this.liveWeatherData !== undefined) {
      this.getForecastWeather(
          `${this.liveWeatherData.location.name}, ${this.liveWeatherData.location.country}`);
    }
    if (!this.showForecastWeather && this.forecastWeatherData !== undefined) {
      this.getLiveWeather(
          `${this.forecastWeatherData.location.name}, \
          ${this.forecastWeatherData.location.country}`);
    }
    this.showForecastWeather = $event.checked;
  }

  // Retrieve weather from weather api
  getWeather(): void {
    // Form not valid
    const input: string = this.weatherLocationInput.value;
    if (input === null || input.length < 3) {
      this.toaster.error('Please enter a longer query', 'Error!');
      return;
    }
    // Retrieve weather based on selected weather type
    const weatherType: WeatherType =
    this.showForecastWeather ? WeatherType.Forecast : WeatherType.Live;
    // Live weather
    if (weatherType === WeatherType.Live) {
      this.getLiveWeather(this.weatherLocationInput.value);
    } else { // Forecast weather
      this.getForecastWeather(this.weatherLocationInput.value);
    }
  }

  // Get live weather
  private getLiveWeather(weatherLocation: string): void {
    this.weatherapiService.getLiveWeather(weatherLocation).subscribe({
      next: (weatherData: AxiosResponse<WeatherLiveResponse>) => {
        // Send weather data to the service
        this.weatherdataService.setLiveWeatherData(weatherData.data);
        // Set the theme based on whether it is daytime
        const isDay: number = weatherData.data.current.is_day;
        if (isDay === 1) {
          this.themeService.setLightTheme();
        } else {
          this.themeService.setDarkTheme();
        }
        // If the user is logged in, save the weather data to their profile
        if (this.user) {
          const weatherQuery: WeatherQuery = {
            location: weatherLocation,
            type: WeatherType.Live,
            dateQueried: Date.now(),
          };
          this.firestoreService.logLiveWeatherQuery(this.user, weatherQuery);
          this.pastqueriesService.appendQuery(weatherQuery);
          this.weatherLocationInput.reset();
        }
      },
      error: (error: Error) => {
        this.toaster.error('Failed to live weather', 'Error!');
        console.log(error);
      },
    });
  }

  // Get forecast weather
  private getForecastWeather(weatherLocation: string): void {
    this.weatherapiService.getForecastWeather(weatherLocation).subscribe({
      next: (weatherData: AxiosResponse<WeatherForecastResponse>) => {
        this.weatherdataService.setForecastWeatherData(weatherData.data);
        // Set the theme based on whether it is daytime
        const isDay: number = weatherData.data.current.is_day;
        if (isDay === 1) {
          this.themeService.setLightTheme();
        } else {
          this.themeService.setDarkTheme();
        }
        // If the user is logged in, save the weather data to their profile
        if (this.user) {
          const weatherQuery: WeatherQuery = {
            location: weatherLocation,
            type: WeatherType.Forecast,
            dateQueried: Date.now(),
          };
          this.firestoreService.logForecastWeatherQuery(
              this.user, weatherQuery);
          this.pastqueriesService.appendQuery(weatherQuery);
        };
        this.weatherLocationInput.reset();
      },
      error: (error: Error) => {
        this.toaster.error('Failed to forecast weather', 'Error!');
        console.log(error);
      },
    });
  }

  // Execute a new weather query from historical query
  executePastQuery(pastQuery: WeatherQuery): void {
    // Slide the toggle to the right direction
    if (
      (this.slideToggle!.checked && pastQuery.type === WeatherType.Live) ||
      (!this.slideToggle!.checked && pastQuery.type === WeatherType.Forecast)) {
        this.slideToggle!.toggle();
    }
    if (pastQuery.type === WeatherType.Live) {
      this.getLiveWeather(pastQuery.location);
    } else {
      this.getForecastWeather(pastQuery.location);
    }
    // Close the drawer once a query is made for mobile devices
    if (this.deviceService.isMobile()) this.drawer?.close();
  }

  // Call past queries service to delete all queries
  deletePastQueries(): void {
    if (!confirm('Are you sure you want to clear your query history?')) return;
    this.pastqueriesService.emptyQueries(this.user!);
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
