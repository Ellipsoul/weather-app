import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ForecastDayObject, WeatherForecastResponse } from 'src/app/services/weatherapi.service';
import { dayWeatherTypeMap, nightWeatherTypeMap, UnitSystem,
  WeatherdataService } from 'src/app/services/weatherdata.service';
import { DateTimeFormatPipe } from 'src/app/pipes/datetimeformat.pipe';

@Component({
  selector: 'app-forecast-weather',
  templateUrl: './forecast-weather.component.html',
  styleUrls: ['./forecast-weather.component.css'],
  providers: [DateTimeFormatPipe],
})
export class ForecastWeatherComponent implements OnDestroy {
  // Forecast Weather data retrieved from service
  forecastWeatherData: WeatherForecastResponse | undefined;
  forecastWeatherDataSubscription: Subscription;
  // Useful variables extracted from forecastWeatherData
  // temperature: string | undefined;
  dateIso: string | undefined;
  locationString: string | undefined;
  weatherBackgrounds: string[] | undefined;
  // Keep track of metric or imperial units to display
  unitSystem: UnitSystem;

  constructor(private weatherdataService: WeatherdataService) {
    // Subscribe to the incoming forecast weather data
    this.forecastWeatherDataSubscription = this.weatherdataService.forecastWeatherData.subscribe(
        (weatherForecastResponse: WeatherForecastResponse) => {
          this.forecastWeatherData = weatherForecastResponse;
          this.updateUsefulVariables();
        });
    // Retrieve the preferred unit system, defaulting to metric
    const unitSystem = localStorage.getItem('unitSystem');
    if (unitSystem === null) {
      localStorage.setItem('unitSystem', UnitSystem.Metric);
    }
    this.unitSystem = localStorage.getItem('unitSystem') as UnitSystem;
  }

  // Switch between metric and imperial units
  toggleUnitSystem($event: string): void {
    this.unitSystem = $event as UnitSystem;
    localStorage.setItem('unitSystem', $event);
    this.updateUsefulVariables();
  }

  ngOnDestroy(): void {
    this.forecastWeatherDataSubscription.unsubscribe();
  }

  private updateUsefulVariables(): void {
    // Manually adding a leading 0 for poorly formatted date
    const time: string = this.forecastWeatherData!.location.localtime;
    this.dateIso = time[time.length-5] !== ' ' ? time :
      time.slice(0, time.length-4) + '0' + time.slice(time.length-4);
    this.locationString =
      `${this.forecastWeatherData!.location.name}, ${this.forecastWeatherData!.location.country}`;
    const weatherCodes: string[] = this.forecastWeatherData!.forecast.forecastday.map(
        (forecastDay: ForecastDayObject) => forecastDay.day.condition.code.toString());
    this.weatherBackgrounds = this.forecastWeatherData?.current.is_day === 1 ?
      weatherCodes.map((weatherCode: string) => dayWeatherTypeMap[weatherCode]) :
      weatherCodes.map((weatherCode: string) => nightWeatherTypeMap[weatherCode]);
  }
}
