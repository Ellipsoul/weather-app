import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherLiveResponse } from 'src/app/services/weatherapi.service';
import { WeatherdataService } from 'src/app/services/weatherdata.service';

@Component({
  selector: 'app-live-weather',
  templateUrl: './live-weather.component.html',
  styleUrls: ['./live-weather.component.css'],
})
export class LiveWeatherComponent implements OnDestroy {
  // Live Weather data retrieved from service
  liveWeatherData: WeatherLiveResponse | undefined;
  liveWeatherDataSubscription: Subscription;
  // Useful variables extracted from liveWeatherData
  locationString: string | undefined;
  // Keep track of metric or imperial units to display
  unitSystem: UnitSystem;

  constructor(private weatherdataService: WeatherdataService) {
    // Subscribe to the incoming live weather data
    this.liveWeatherDataSubscription = this.weatherdataService.liveWeatherData.subscribe(
        (weatherLiveResponse: WeatherLiveResponse) => {
          this.liveWeatherData = weatherLiveResponse;
          // Update useful variables once liveWeatherData is updated
          this.locationString =
          `${this.liveWeatherData.location.name}, ${this.liveWeatherData.location.country}`;
        });
    // Retrieve the preferred unit system, defaulting to metric
    const unitSystem = localStorage.getItem('unitSystem');
    if (unitSystem === null) {
      localStorage.setItem('unitSystem', UnitSystem.Metric);
    }
    this.unitSystem = localStorage.getItem('unitSystem') as UnitSystem;
  }

  ngOnDestroy(): void {
    this.liveWeatherDataSubscription.unsubscribe();
  }

  toggleUnitSystem($event: string): void {
    this.unitSystem = $event as UnitSystem;
    localStorage.setItem('unitSystem', $event);
  }
}

// eslint-disable-next-line no-unused-vars
enum UnitSystem {
  // eslint-disable-next-line no-unused-vars
  Metric = 'metric',
  // eslint-disable-next-line no-unused-vars
  Imperial = 'imperial',
}
