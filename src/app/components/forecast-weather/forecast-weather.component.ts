import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WeatherForecastResponse } from 'src/app/services/weatherapi.service';
import { WeatherdataService } from 'src/app/services/weatherdata.service';

@Component({
  selector: 'app-forecast-weather',
  templateUrl: './forecast-weather.component.html',
  styleUrls: ['./forecast-weather.component.css'],
})
export class ForecastWeatherComponent implements OnDestroy {
  // Forecast Weather data retrieved from service
  forecastWeatherData: WeatherForecastResponse | undefined;
  forecastWeatherDataSubscription: Subscription;

  constructor(private weatherdataService: WeatherdataService) {
    this.forecastWeatherDataSubscription = this.weatherdataService.forecastWeatherData.subscribe(
        (weatherForecastResponse: WeatherForecastResponse) => {
          this.forecastWeatherData = weatherForecastResponse;
        });
  }

  ngOnDestroy(): void {
    this.forecastWeatherDataSubscription.unsubscribe();
  }
}
