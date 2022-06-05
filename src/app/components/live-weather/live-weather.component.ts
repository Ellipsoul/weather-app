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

  constructor(private weatherdataService: WeatherdataService) {
    this.liveWeatherDataSubscription = this.weatherdataService.liveWeatherData.subscribe(
        (weatherLiveResponse: WeatherLiveResponse) => {
          this.liveWeatherData = weatherLiveResponse;
        });
  }

  ngOnDestroy(): void {
    this.liveWeatherDataSubscription.unsubscribe();
  }
}
